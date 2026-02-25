const { Router } = require("express");

const productController = require("./product.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");
const upload = require("../../middleware/upload.middleware");
const variantRouter = require("../product-variant/variant.router");
const requireProductVariantImages = require("../../middleware/requireProductVariantImages.middleware");

const validate = require("../../middleware/validate.middleware");
const {
  createProductSchema,
  updateProductSchema,
} = require("./product.schemas");

const router = Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  upload.any(),
  validate(createProductSchema),
  requireProductVariantImages(),
  productController.create,
);

router.delete(
  "/:productId",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  productController.delete,
);

router.patch(
  "/:productId",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  upload.none(),
  validate(updateProductSchema),
  productController.update,
);

router.get("/", productController.getAll);
router.get("/:productId", productController.getOne);

router.use("/:productId/variants", variantRouter);

module.exports = router;
