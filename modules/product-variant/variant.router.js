const { Router } = require("express");
const variantController = require("./variant.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");
const upload = require("../../middleware/upload.middleware");
const imageRouter = require("../product-variant-images/image.router");
const validate = require("../../middleware/validate.middleware");
const requireUploadMiddleware = require("../../middleware/requireUpload.middleware");

const {
  createVariantSchema,
  updateVariantSchema,
  deleteVariantSchema,
} = require("./variant.schemas");

const router = Router({ mergeParams: true });

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  upload.array("images"),
  requireUploadMiddleware({ min: 1, field: "images" }),
  validate(createVariantSchema),
  variantController.create,
);

router.patch(
  "/:variantId",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  upload.none(),
  validate(updateVariantSchema),
  variantController.update,
);

router.delete(
  "/:variantId",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validate(deleteVariantSchema),
  variantController.delete,
);

router.use("/:variantId/images", imageRouter);

module.exports = router;
