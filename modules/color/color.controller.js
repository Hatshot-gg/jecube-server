const colorService = require("./color.service");

class ColorController {
  async getAll(req, res, next) {
    try {
      const data = await colorService.getAll();
      res.json(data);
    } catch (e) {
      next(e);
    }
  }

  async create(req, res, next) {
    try {
      const data = await colorService.create(req.body);
      res.json(data);
    } catch (e) {
      next(e);
    }
  }

  async delete(req, res, next) {
    try {
      const data = await colorService.delete(req.params.colorId);
      res.json(data);
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    try {
      const data = await colorService.update(req.params.colorId, req.body);
      res.json(data);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ColorController();
