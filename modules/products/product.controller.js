const productService = require("./product.service");

class ProductController {
  async getOne(req, res, next) {
    try {
      const data = await productService.getOne(req.params.productId);
      res.json(data);
    } catch (e) {
      next(e);
    }
  }

  async getAll(req, res, next) {
    try {
      const data = await productService.getAll();
      res.json(data);
    } catch (e) {
      next(e);
    }
  }

  async create(req, res, next) {
    try {
      const dto = req.body;
      const files = req.files || [];

      const data = await productService.create(dto, files);
      res.json(data);
    } catch (e) {
      next(e);
    }
  }

  async delete(req, res, next) {
    try {
      const data = await productService.delete(req.params.productId);
      res.json(data);
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    try {
      const { productId } = req.params;

      const data = await productService.update(productId, req.body);
      res.json(data);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ProductController();
