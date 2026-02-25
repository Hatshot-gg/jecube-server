const Router = require("express");
const userController = require("./user.controller");
const authMiddleware = require("../../middleware/auth.middleware");

const router = new Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/refresh", userController.refresh);
router.post("/logout", userController.logout);

router.get("/me", authMiddleware, userController.getUser);

module.exports = router;
