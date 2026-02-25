const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const Product = sequelize.define(
  "Product",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    name: { type: DataTypes.STRING, allowNull: false },

    description: { type: DataTypes.TEXT, allowNull: false },

    gender: {
      type: DataTypes.ENUM("men", "women", "unisex"),
      allowNull: false,
    },

    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "active",
      validate: {
        isIn: [["draft", "active", "archived"]],
      },
    },
  },
  {
    tableName: "products",
    timestamps: true,
  },
);

module.exports = Product;
