const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: "USER" },
    refreshToken: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: "users",
    timestamps: true,
  },
);

module.exports = User;

// User.associate = (models) => {
//   User.hasMany(models.Order, {
//     foreignKey: "userId",
//   });
// };
