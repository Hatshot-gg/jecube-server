const { Category } = require("../../models/models");

const ApiError = require("../../errors/ApiError");
const sequelize = require("../../db");

class CategoryService {
  async create(dto) {
    const t = await sequelize.transaction();
    try {
      const name = (dto?.name || "").trim();
      if (!name) throw ApiError.badRequest('Поле "name" обязательно');

      const slug = (dto?.slug || slugify(name)).trim();
      if (!slug)
        throw ApiError.badRequest('Поле "slug" пустое (проверь name/slug)');

      const existingByName = await Category.findOne({
        where: { name },
        transaction: t,
      });
      if (existingByName) {
        throw ApiError.badRequest(
          `Категория с названием "${name}" уже существует`,
        );
      }

      const existingBySlug = await Category.findOne({
        where: { slug },
        transaction: t,
      });
      if (existingBySlug) {
        throw ApiError.badRequest(`Категория со slug "${slug}" уже существует`);
      }

      await Category.create({ name, slug }, { transaction: t });

      await t.commit();
      return await Category.findAll({ order: [["id", "ASC"]] });
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }

  async delete(categoryId) {
    const t = await sequelize.transaction();
    try {
      const category = await Category.findByPk(categoryId, { transaction: t });

      if (!category) throw ApiError.notFound("Категория не найдена");

      await category.destroy({ transaction: t });

      await t.commit();
      return { message: "Категория удалена" };
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }

  async getAll() {
    return await Category.findAll({ order: [["id", "ASC"]] });
  }

  async update(categoryId, dto) {
    const t = await sequelize.transaction();

    try {
      const category = await Category.findByPk(categoryId, { transaction: t });
      if (!category) throw ApiError.notFound("Категория не найдена");

      const nextName =
        dto?.name !== undefined ? String(dto.name).trim() : category.name;

      const nextSlug =
        dto?.slug !== undefined
          ? String(dto.slug).trim()
          : dto?.name !== undefined
            ? slugify(nextName)
            : category.slug;

      if (!nextName) throw ApiError.badRequest('Поле "name" обязательно');
      if (!nextSlug) throw ApiError.badRequest('Поле "slug" обязательно');

      const existingByName = await Category.findOne({
        where: { name: nextName },
        transaction: t,
      });
      if (existingByName && existingByName.id !== Number(categoryId)) {
        throw ApiError.badRequest(
          `Категория с названием "${nextName}" уже существует`,
        );
      }

      const existingBySlug = await Category.findOne({
        where: { slug: nextSlug },
        transaction: t,
      });
      if (existingBySlug && existingBySlug.id !== Number(categoryId)) {
        throw ApiError.badRequest(
          `Категория со slug "${nextSlug}" уже существует`,
        );
      }

      category.name = nextName;
      category.slug = nextSlug;

      await category.save({ transaction: t });

      await t.commit();
      return await Category.findAll({ order: [["id", "ASC"]] });
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }
}

module.exports = new CategoryService();
