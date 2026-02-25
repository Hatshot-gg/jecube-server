const { Router } = require("express");

const colorController = require("./color.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");

const validate = require("../../middleware/validate.middleware");

const {
  createColorSchema,
  updateColorSchema,
  deleteColorSchema,
} = require("./color.schemas");

const router = Router();

router.get("/", colorController.getAll);

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validate(createColorSchema),
  colorController.create,
);

router.delete(
  "/:colorId",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validate(deleteColorSchema),
  colorController.delete,
);

router.patch(
  "/:colorId",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validate(updateColorSchema),
  colorController.update,
);

module.exports = router;
