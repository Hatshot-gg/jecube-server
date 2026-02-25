const variantService = require("./variant.service");

class VariantController {
  async create(req, res, next) {
    try {
      const dto = req.body;

      const files = req.files || [];

      const { productId } = req.params;

      const data = await variantService.create(productId, dto, files);
      res.json(data);
    } catch (e) {
      next(e);
    }
  }

  async delete(req, res, next) {
    try {
      const data = await variantService.delete(req.params.variantId);
      res.json(data);
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    try {
      const { variantId } = req.params;

      const data = await variantService.update(variantId, req.body);
      res.json(data);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new VariantController();
