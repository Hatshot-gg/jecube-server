const Router = require("express");
const router = new Router();

const userRouter = require("./modules/users/user.router");
const errorMiddleware = require("./middleware/error.middleware");
const productRouter = require("./modules/products/product.router");
const variantRouter = require("./modules/product-variant/variant.router");
const cartRouter = require("./modules/cart/cart.router");
const categoryRouter = require("./modules/category/category.router");
const colorRouter = require("./modules/color/color.router");

// const orderRouter = require('./modules/orders/order.router')

router.use("/users", userRouter);
router.use("/products", productRouter);
router.use("/variants", variantRouter);
router.use("/cart", cartRouter);
router.use("/categories", categoryRouter);
router.use("/colors", colorRouter);

router.use(errorMiddleware);

// router.use('/orders', orderRouter)

module.exports = router;
