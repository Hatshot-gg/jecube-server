const ImageService = require("./image.service");

class ImageController {
  async create(req, res, next) {
    try {
      const file = req.file;

      const { variantId } = req.params;

      const data = await ImageService.create(variantId, file);
      res.json(data);
    } catch (e) {
      next(e);
    }
  }

  async delete(req, res, next) {
    try {
      const data = await ImageService.delete(req.params.imageId);
      res.json(data);
    } catch (e) {
      next(e);
    }
  }

  async setMain(req, res, next) {
    try {
      const { variantId, imageId } = req.params;

      const data = await ImageService.setMain(variantId, imageId);
      res.json(data);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ImageController();
