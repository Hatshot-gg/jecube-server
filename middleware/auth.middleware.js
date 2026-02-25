const jwt = require("jsonwebtoken");
const ApiError = require("../errors/ApiError");
const { User } = require("../models/models");
module.exports = async function (req, res, next) {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return next(ApiError.unauthorized());
    }

    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return next(ApiError.unauthorized());
    }

    req.user = decoded;
    next();
  } catch (e) {
    return next(ApiError.unauthorized());
  }
};
