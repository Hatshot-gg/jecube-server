const User = require("./user.model");
const Product = require("./product.model");
const ProductVariantImage = require("./product-variant-image.model");
const ProductVariant = require("./product-variant.model");
const Cart = require("./cart.model");
const CartItem = require("./cart-item.model");
const Color = require("./color.model");
const Category = require("./category.model");

Product.hasMany(ProductVariant, {
  as: "variants",
  foreignKey: "productId",
});

ProductVariant.belongsTo(Product, {
  foreignKey: "productId",
});

ProductVariant.hasMany(ProductVariantImage, {
  as: "images",
  foreignKey: "variantId",
  onDelete: "CASCADE",
});

ProductVariantImage.belongsTo(ProductVariant, {
  foreignKey: "variantId",
});

Cart.belongsTo(User, {
  foreignKey: "userId",
});

Cart.hasMany(CartItem, {
  foreignKey: "cartId",
  onDelete: "CASCADE",
});

CartItem.belongsTo(Cart, {
  foreignKey: "cartId",
});

CartItem.belongsTo(Product, {
  foreignKey: "productId",
});

CartItem.belongsTo(ProductVariant, {
  foreignKey: "variantId",
});

Category.hasMany(Product, {
  foreignKey: "categoryId",
});

Product.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category",
});

Color.hasMany(ProductVariant, {
  foreignKey: "colorId",
});

ProductVariant.belongsTo(Color, {
  foreignKey: "colorId",
  as: "color",
});

module.exports = {
  User,
  Product,
  ProductVariantImage,
  ProductVariant,
  Cart,
  CartItem,
  Category,
  Color,
};

// const Order = require('../orders/order.model')
// User.hasMany(Order, { foreignKey: 'userId' })
// Order.belongsTo(User, { foreignKey: 'userId' })

// Order.belongsToMany(Product, { through: 'order_products' })
// Product.belongsToMany(Order, { through: 'order_products' })
