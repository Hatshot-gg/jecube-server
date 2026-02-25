const cartService = require("./cart.service");

class CartController {
  async getCart(req, res, next) {
    try {
      const userId = req.user.id;
      const data = await cartService.getCart(userId);
      res.json(data);
    } catch (e) {
      next(e);
    }
  }

  async addItem(req, res, next) {
    try {
      const userId = req.user.id;
      const data = await cartService.addItem(userId, req.body.variantId);
      res.json(data);
    } catch (e) {
      next(e);
    }
  }

  async updateQuantity(req, res, next) {
    try {
      const userId = req.user.id;
      const { quantity } = req.body;

      const data = await cartService.updateQuantity(
        userId,
        req.params.itemId,
        quantity,
      );
      res.json(data);
    } catch (e) {
      next(e);
    }
  }

  async removeItem(req, res, next) {
    try {
      const userId = req.user.id;

      const data = await cartService.removeItem(userId, req.params.itemId);
      res.json(data);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new CartController();
