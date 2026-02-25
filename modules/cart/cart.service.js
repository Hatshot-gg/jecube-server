const {
  Cart,
  CartItem,
  Product,
  ProductVariant,
} = require("../../models/models");

const ApiError = require("../../errors/ApiError");
const sequelize = require("../../db");

async function getOrCreateCart(userId, t = null) {
  try {
    const [cart] = await Cart.findOrCreate({
      where: { userId },
      defaults: { userId },
      transaction: t,
    });
    return cart;
  } catch (e) {
    throw e;
  }
}

class CartService {
  async getCart(userId) {
    try {
      const cart = await getOrCreateCart(userId);

      return await CartItem.findAll({
        where: { cartId: cart.id },
        include: [{ model: Product }, { model: ProductVariant }],
        order: [["createdAt", "DESC"]],
      });
    } catch (e) {
      throw e;
    }
  }

  async addItem(userId, variantId) {
    const t = await sequelize.transaction();

    try {
      const cart = await getOrCreateCart(userId, t);

      const variant = await ProductVariant.findByPk(variantId, {
        transaction: t,
      });

      if (!variant) throw ApiError.notFound("Вариант не найден");

      const existing = await CartItem.findOne({
        where: { cartId: cart.id, variantId },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (existing) {
        await existing.increment("quantity", { by: 1, transaction: t });
        await existing.reload({ transaction: t });
        await t.commit();
        return existing;
      }

      const item = await CartItem.create(
        {
          cartId: cart.id,
          productId: variant.productId,
          variantId,
          quantity: 1,
        },
        { transaction: t },
      );

      await t.commit();
      return item;
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }

  async updateQuantity(userId, itemId, quantity) {
    if (![1, -1].includes(quantity))
      throw ApiError.badRequest("quantity должен быть 1 или -1");

    const t = await sequelize.transaction();

    try {
      const cart = await getOrCreateCart(userId, t);

      const item = await CartItem.findOne({
        where: { id: itemId, cartId: cart.id },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!item) throw ApiError.notFound("Товар не найден");

      if (quantity === -1 && item.quantity <= 1) {
        await item.destroy({ transaction: t });
        await t.commit();
        return { message: "Товар удален" };
      }

      if (quantity === 1) {
        await item.increment("quantity", { by: 1, transaction: t });
      } else {
        await item.decrement("quantity", { by: 1, transaction: t });
      }

      await item.reload({ transaction: t });
      await t.commit();
      return item;
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }

  async removeItem(userId, itemId) {
    const t = await sequelize.transaction();

    try {
      const cart = await getOrCreateCart(userId, t);

      await CartItem.destroy({
        where: { id: itemId, cartId: cart.id },
        transaction: t,
      });

      await t.commit();
      return { message: "Товар удален" };
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }
}

module.exports = new CartService();
