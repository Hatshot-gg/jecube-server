const fs = require("fs");

const {
  Product,
  ProductVariantImage,
  ProductVariant,
  Category,
  Color,
} = require("../../models/models");

const ApiError = require("../../errors/ApiError");
const sequelize = require("../../db");
const path = require("path");
const { Op } = require("sequelize");

const normalizeMainIndex = require("../../utils/normalizeMainIndex");
const { getProductById, getAllProducts } = require("./product.query");

function groupFilesByVariantIndex(files = []) {
  const map = new Map();

  for (const file of files) {
    const m = file.fieldname?.match(/^variants\[(\d+)\]\[images\]$/);
    if (!m) continue;

    const idx = Number(m[1]);
    if (!map.has(idx)) map.set(idx, []);
    map.get(idx).push(file);
  }
  return map;
}

function toAbsoluteFromUrl(url) {
  const rel = url.startsWith("/") ? url.slice(1) : url;
  return path.resolve(process.cwd(), rel);
}

class ProductService {
  async create(dto, files) {
    const t = await sequelize.transaction();
    const createdFilePaths = (files || []).map((f) => f.path).filter(Boolean);

    try {
      const { name, description, gender, categoryId, status, variants } = dto;

      if (categoryId) {
        const category = await Category.findByPk(categoryId, {
          transaction: t,
        });
        if (!category) throw ApiError.notFound("Категория не найдена");
      }

      const skus = variants.map((v) => v.sku);

      const existing = await ProductVariant.findOne({
        where: { sku: { [Op.in]: skus } },
        transaction: t,
      });

      if (existing) {
        throw ApiError.badRequest(`SKU "${existing.sku}" уже существует`);
      }

      const colorIds = variants.map((v) => v.colorId).filter(Boolean);
      if (colorIds.length) {
        const uniq = [...new Set(colorIds.map(Number))];
        const count = await Color.count({
          where: { id: { [Op.in]: uniq } },
          transaction: t,
        });
        if (count !== uniq.length) {
          throw ApiError.badRequest("Один из colorId не существует");
        }
      }

      const product = await Product.create(
        {
          name,
          description,
          gender,
          categoryId,
          status: status ?? "active",
        },
        { transaction: t },
      );

      const filesByIndex = groupFilesByVariantIndex(files);

      for (let i = 0; i < variants.length; i++) {
        const v = variants[i];

        const variant = await ProductVariant.create(
          {
            productId: product.id,
            sku: v.sku,
            price: v.price,
            stock: v.stock ?? 0,
            colorId: v.colorId ?? null,
            size: v.size ?? null,
          },
          { transaction: t },
        );

        const vFiles = filesByIndex.get(i) || [];

        if (vFiles.length) {
          const mainIdx = normalizeMainIndex(v.mainImageIndex, vFiles.length);
          const imagesData = vFiles.map((file, idx) => {
            return {
              variantId: variant.id,
              url: `/uploads/products/${file.filename}`,
              isMain: idx === mainIdx,
              sortOrder: idx,
            };
          });

          await ProductVariantImage.bulkCreate(imagesData, { transaction: t });
        }
      }

      await t.commit();

      return await getProductById(product.id);
    } catch (e) {
      await t.rollback();
      for (const p of createdFilePaths) {
        try {
          fs.unlinkSync(p);
        } catch (_) {}
      }
      throw e;
    }
  }

  async delete(id) {
    const product = await Product.findByPk(id, {
      include: [
        {
          model: ProductVariant,
          as: "variants",
          include: [{ model: ProductVariantImage, as: "images" }],
        },
      ],
    });

    if (!product) throw ApiError.notFound("Товар не найден");

    try {
      const variants = product.variants || [];
      for (const v of variants) {
        const images = v.images || [];
        for (const img of images) {
          const absolutePath = toAbsoluteFromUrl(img.url);
          if (fs.existsSync(absolutePath)) fs.unlinkSync(absolutePath);
        }
      }
    } catch (_) {}

    await product.destroy();
    return { message: "Товар удалён" };
  }

  async getOne(id) {
    const product = getProductById(id);

    if (!product) throw ApiError.notFound("Товар не найден");

    return product;
  }

  async getAll() {
    return await getAllProducts();
  }

  async update(productId, dto) {
    const t = await sequelize.transaction();

    try {
      const product = await Product.findByPk(productId, {
        transaction: t,
      });

      if (!product) {
        throw ApiError.notFound("Товар не найден");
      }

      const cat = await Category.findByPk(dto.categoryId, { transaction: t });

      if (!cat) throw ApiError.notFound("Категория не найдена");

      product.set(dto);

      await product.save({ transaction: t });

      await t.commit();

      return await getProductById(product.id);
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }
}

module.exports = new ProductService();
