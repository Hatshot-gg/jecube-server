const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const ProductVariantImage = sequelize.define(
  "ProductVariantImage",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isMain: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    variantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "product_variant_images",
    timestamps: true,
  },
);

module.exports = ProductVariantImage;
