const fs = require("fs");
const path = require("path");

const { ProductVariant, ProductVariantImage } = require("../../models/models");

const ApiError = require("../../errors/ApiError");
const sequelize = require("../../db");

function toAbsPathFromUrl(url) {
  return path.resolve(process.cwd(), url.replace(/^\//, ""));
}

class VariantService {
  async create(variantId, file) {
    const t = await sequelize.transaction();
    try {
      const variant = await ProductVariant.findByPk(variantId, {
        transaction: t,
      });
      if (!variant) throw ApiError.notFound("Вариант не найден");

      const maxOrder = await ProductVariantImage.max("sortOrder", {
        where: { variantId },
        transaction: t,
      });

      const nextOrder = Number.isFinite(maxOrder) ? maxOrder + 1 : 0;

      await ProductVariantImage.create(
        {
          variantId,
          url: `/uploads/products/${file.filename}`,
          sortOrder: nextOrder,
          isMain: false,
        },
        { transaction: t },
      );

      await t.commit();

      return await ProductVariant.findByPk(variantId, {
        include: [{ model: ProductVariantImage, as: "images" }],
        order: [
          [{ model: ProductVariantImage, as: "images" }, "sortOrder", "ASC"],
        ],
      });
    } catch (e) {
      await t.rollback();
      try {
        fs.unlinkSync(file.path);
      } catch (_) {}
      throw e;
    }
  }

  async delete(imageId) {
    const t = await sequelize.transaction();

    try {
      const image = await ProductVariantImage.findByPk(imageId, {
        transaction: t,
      });

      if (!image) throw ApiError.notFound("Фото не найдено");

      const wasMain = !!image.isMain;
      const absPath = image.url ? toAbsPathFromUrl(image.url) : null;

      await image.destroy({ transaction: t });

      if (wasMain) {
        const newMain = await ProductVariantImage.findOne({
          where: { variantId: image.variantId },
          order: [
            ["sortOrder", "ASC"],
            ["id", "ASC"],
          ],
          transaction: t,
        });

        if (newMain) {
          await ProductVariantImage.update(
            { isMain: false },
            { where: { variantId: image.variantId }, transaction: t },
          );
          await newMain.update({ isMain: true }, { transaction: t });
        }
      }

      await t.commit();

      if (absPath) {
        try {
          fs.unlinkSync(absPath);
        } catch (_) {}
      }

      return await ProductVariant.findByPk(image.variantId, {
        include: [{ model: ProductVariantImage, as: "images" }],
        order: [
          [{ model: ProductVariantImage, as: "images" }, "sortOrder", "ASC"],
        ],
      });
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }

  async setMain(variantId, imageId) {
    const t = await sequelize.transaction();

    try {
      const image = await ProductVariantImage.findOne({
        where: { id: imageId, variantId },
        transaction: t,
      });

      if (!image) throw ApiError.notFound("Фото не найдено");

      if (!image.isMain) {
        await ProductVariantImage.findAll({
          where: { variantId },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        await ProductVariantImage.update(
          { isMain: false },
          { where: { variantId }, transaction: t },
        );

        await image.update({ isMain: true }, { transaction: t });
      }

      await t.commit();

      return await ProductVariant.findByPk(variantId, {
        include: [
          {
            model: ProductVariantImage,
            as: "images",
            separate: true,
            order: [["sortOrder", "ASC"]],
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
