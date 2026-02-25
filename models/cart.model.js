const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const Cart = sequelize.define(
  "Cart",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "carts",
    timestamps: true,
  },
);

module.exports = Cart;
