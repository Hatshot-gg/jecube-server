const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");

const {
  Product,
  ProductVariant,
  ProductVariantImage,
  Color,
} = require("../../models/models");

const ApiError = require("../../errors/ApiError");
const sequelize = require("../../db");

const normalizeMainIndex = require("../../utils/normalizeMainIndex");

function toAbsPathFromUrl(url) {
  return path.resolve(process.cwd(), url.replace(/^\//, ""));
}

class VariantService {
  async create(productId, dto, files = []) {
    const t = await sequelize.transaction();
    const createdFilePaths = [];

    try {
      const { sku, price, stock, colorId, size, status, mainImageIndex } = dto;

      const existing = await ProductVariant.findOne({
        where: { sku },
      });

      if (existing) {
        throw ApiError.badRequest(`SKU "${existing.sku}" уже существует`);
      }

      const color = await Color.findByPk(colorId, { transaction: t });

      if (!color) throw ApiError.badRequest("Цвет не найден");

      const variant = await ProductVariant.create(
        {
          productId,
          sku,
          price,
          stock,
          colorId,
          size: size ?? null,
          status: status ?? "active",
        },
        { transaction: t },
      );

      const mainIdx = normalizeMainIndex(mainImageIndex, files.length);

      const imagesData = files.map((file, idx) => {
        if (file?.path) createdFilePaths.push(file.path);

        return {
          variantId: variant.id,
          url: `/uploads/products/${file.filename}`,
          isMain: idx === mainIdx,
          sortOrder: idx,
        };
      });

      if (imagesData.length) {
        await ProductVariantImage.bulkCreate(imagesData, { transaction: t });
      }

      await t.commit();

      return await Product.findByPk(productId, {
        include: [
          {
            model: ProductVariant,
            as: "variants",
            include: [{ model: ProductVariantImage, as: "images" }],
          },
        ],
      });
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

  async delete(variantId) {
    const t = await sequelize.transaction();

    try {
      const variant = await ProductVariant.findByPk(variantId, {
        include: [{ model: ProductVariantImage, as: "images" }],
        transaction: t,
      });

      if (!variant) throw ApiError.notFound("Вариант не найден");

      const productId = variant.productId;

      const filePathsToDelete = (variant.images || [])
        .map((img) => img?.url)
        .filter(Boolean)
        .map(toAbsPathFromUrl);

      await ProductVariant.destroy({
        where: { id: variantId },
        transaction: t,
      });

      await t.commit();

      for (const p of filePathsToDelete) fs.unlinkSync(p);

      return await Product.findByPk(productId, {
        include: [
          {
            model: ProductVariant,
            as: "variants",
            include: [{ model: ProductVariantImage, as: "images" }],
          },
        ],
      });
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }

  async update(variantId, dto) {
    const t = await sequelize.transaction();

    try {
      const variant = await ProductVariant.findByPk(variantId, {
        transaction: t,
      });

      if (!variant) {
        throw ApiError.notFound("Вариант не найден");
      }

      if (dto?.sku && dto.sku !== variant.sku) {
        const existing = await ProductVariant.findOne({
          where: {
            sku: dto.sku,
            id: { [Op.ne]: variantId },
          },
          transaction: t,
        });

        if (existing) {
          throw ApiError.badRequest(`SKU "${existing.sku}" уже существует`);
        }

        variant.sku = dto.sku;
      }

      const color = await Color.findByPk(dto.colorId, { transaction: t });
      if (!color) throw ApiError.badRequest("Цвет не найден");
      variant.colorId = dto.colorId;

      const fields = ["price", "stock", "color", "size", "status"];

      for (const key of fields) {
        if (dto[key] !== undefined) {
          variant[key] = dto[key];
        }
      }

      await variant.save({ transaction: t });

      await t.commit();

      return await Product.findByPk(variant.productId, {
        include: [
          {
            model: ProductVariant,
            as: "variants",
            include: [{ model: ProductVariantImage, as: "images" }],
          },
        ],
      });
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }
}

module.exports = new VariantService();
