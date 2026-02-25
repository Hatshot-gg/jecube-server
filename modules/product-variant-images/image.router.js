const { Router } = require("express");
const imageController = require("./image.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");
const upload = require("../../middleware/upload.middleware");
const validate = require("../../middleware/validate.middleware");
const requireUploadMiddleware = require("../../middleware/requireUpload.middleware");

const {
  createImageSchema,
  deleteImageSchema,
  setMainImageSchema,
} = require("./image.schemas");

const router = Router({ mergeParams: true });

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  upload.single("image"),
  requireUploadMiddleware({ min: 1, field: "image" }),
  validate(createImageSchema),
  imageController.create,
);

router.delete(
  "/:imageId",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validate(deleteImageSchema),
  imageController.delete,
);

router.patch(
  "/:imageId",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validate(setMainImageSchema),
  imageController.setMain,
);

module.exports = router;
