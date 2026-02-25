const { Router } = require("express");

const cartController = require("./cart.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const validate = require("../../middleware/validate.middleware");
const {
  addCartItemSchema,
  updateCartItemQuantitySchema,
  removeCartItemSchema,
} = require("./cart.schemas");

const router = Router();

router.get("/", authMiddleware, cartController.getCart);

router.post(
  "/items",
  authMiddleware,
  validate(addCartItemSchema),
  cartController.addItem,
);

router.patch(
  "/items/:itemId",
  authMiddleware,
  validate(updateCartItemQuantitySchema),
  cartController.updateQuantity,
);

router.delete(
  "/items/:itemId",
  authMiddleware,
  validate(removeCartItemSchema),
  cartController.removeItem,
);

module.exports = router;
