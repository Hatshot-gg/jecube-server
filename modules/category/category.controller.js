const categoryService = require("./category.service");

class CategoryController {
  async getAll(req, res, next) {
    try {
      const data = await categoryService.getAll();
      res.json(data);
    } catch (e) {
      next(e);
    }
  }

  async create(req, res, next) {
    try {
      const data = await categoryService.create(req.body);
      res.json(data);
    } catch (e) {
      next(e);
    }
  }

  async delete(req, res, next) {
    try {
      const data = await categoryService.delete(req.params.categoryId);
      res.json(data);
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    try {
      const { categoryId } = req.params;

      const data = await categoryService.update(categoryId, req.body);
      res.json(data);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new CategoryController();
