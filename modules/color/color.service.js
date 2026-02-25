const { Color } = require("../../models/models");
const ApiError = require("../../errors/ApiError");
const sequelize = require("../../db");

class ColorService {
  async create(dto) {
    const t = await sequelize.transaction();
    try {
      const name = (dto?.name || "").trim();
      const hex = (dto?.hex || "").trim();
      console.log(dto);

      if (!name) throw ApiError.badRequest('Поле "name" обязательно');
      if (!hex) throw ApiError.badRequest('Поле "hex" обязательно');

      const existingByName = await Color.findOne({
        where: { name },
        transaction: t,
      });

      if (existingByName) {
        throw ApiError.badRequest(`Цвет с названием "${name}" уже существует`);
      }

      const existingByHex = await Color.findOne({
        where: { hex },
        transaction: t,
      });

      if (existingByHex) {
        throw ApiError.badRequest(`такой оттенок "${hex}" уже существует`);
      }

      await Color.create({ name, hex }, { transaction: t });

      await t.commit();
      return await Color.findAll({ order: [["id", "ASC"]] });
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }

  async delete(colorId) {
    const t = await sequelize.transaction();
    try {
      const color = await Color.findByPk(colorId, { transaction: t });
      if (!color) throw ApiError.notFound("Цвет не найден");

      await color.destroy({ transaction: t });

      await t.commit();
      return { message: "Цвет удален" };
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }

  async getAll() {
    return await Color.findAll({ order: [["id", "ASC"]] });
  }

  async update(colorId, dto) {
    const t = await sequelize.transaction();
    try {
      const color = await Color.findByPk(colorId, { transaction: t });
      if (!color) throw ApiError.notFound("Цвет не найден");

      const nextName =
        dto?.name !== undefined ? String(dto.name).trim() : color.name;
      if (!nextName) throw ApiError.badRequest('Поле "name" обязательно');

      const existingByName = await Color.findOne({
        where: { name: nextName },
        transaction: t,
      });

      if (existingByName && existingByName.id !== Number(colorId)) {
        throw ApiError.badRequest(
          `Цвет с названием "${nextName}" уже существует`,
        );
      }

      color.name = nextName;
      await color.save({ transaction: t });

      await t.commit();
      return await Color.findAll({ order: [["id", "ASC"]] });
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }
}

module.exports = new ColorService();
