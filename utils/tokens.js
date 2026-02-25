const jwt = require("jsonwebtoken");

function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.ACCESS_SECRET,
    { expiresIn: "15m" },
  );
}

function generateRefreshToken(user) {
  return jwt.sign({ id: user.id }, process.env.REFRESH_SECRET, {
    expiresIn: "30d",
  });
}

module.exports = { generateAccessToken, generateRefreshToken };
