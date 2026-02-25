const { Router } = require("express");

const categoryController = require("./category.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");

const validate = require("../../middleware/validate.middleware");

const {
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
} = require("./category.schemas");

const router = Router();

router.get("/", categoryController.getAll);

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validate(createCategorySchema),
  categoryController.create,
);

router.delete(
  "/:categoryId",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validate(deleteCategorySchema),
  categoryController.delete,
);

router.patch(
  "/:categoryId",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validate(updateCategorySchema),
  categoryController.update,
);

module.exports = router;
