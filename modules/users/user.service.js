const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../../models/models");
const ApiError = require("../../errors/ApiError");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/tokens");

class UserService {
  async register(email, password) {
    const canditate = await User.findOne({ where: { email } });
    if (canditate) throw ApiError.badRequest("Пользователь уже существует");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await user.update({ refreshToken });

    return { accessToken, refreshToken };
  }

  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) throw ApiError.notFound("Пользователь не найден");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw ApiError.badRequest("Неверный логин или пароль");

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    return { accessToken, refreshToken };
  }

  async refresh(refreshToken) {
    if (!refreshToken) throw ApiError.unauthorized();

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    } catch (e) {
      throw ApiError.unauthorized();
    }

    const user = await User.findByPk(decoded.id);
    if (!user) throw ApiError.unauthorized();

    if (!user.refreshToken || user.refreshToken !== refreshToken) {
      throw ApiError.unauthorized();
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    await user.update({ refreshToken: newRefreshToken });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshToken) {
    if (!refreshToken) return;

    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
      const user = await User.findByPk(decoded.id);
      if (user && user.refreshToken === refreshToken) {
        await user.update({ refreshToken: null });
      }
    } catch {}
  }

  async getUser(userId) {
    const user = await User.findByPk(userId, {
      attributes: ["id", "email", "role"],
    });

    if (!user) {
      throw ApiError.badRequest("Пользователь не найден");
    }

    return user;
  }
}

module.exports = new UserService();
