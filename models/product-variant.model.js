const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const ProductVariant = sequelize.define(
  "ProductVariant",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    productId: { type: DataTypes.INTEGER, allowNull: false },

    sku: { type: DataTypes.STRING, allowNull: false, unique: true },

    price: { type: DataTypes.INTEGER, allowNull: false },

    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },

    size: { type: DataTypes.STRING, allowNull: true },

    colorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "active",
      validate: {
        isIn: [["active", "hidden", "out_of_stock", "discontinued"]],
      },
    },
  },
  {
    tableName: "product_variants",
    timestamps: true,
  },
);
module.exports = ProductVariant;
