const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const Color = sequelize.define(
  "Color",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    hex: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "colors",
    timestamps: true,
  },
);

module.exports = Color;
