const ApiError = require("../errors/ApiError");

module.exports = function errorMiddleware(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      message: err.message,
      errors: err.errors || [],
    });
  }

  if (err?.name === "ZodError") {
    const errors = err.issues.map((i) => ({
      path: i.path.join("."),
      message: i.message,
    }));
    return res.status(400).json({
      message: "Ошибка валидации",
      errors,
    });
  }

  console.error(err);
  return res.status(500).json({ message: "Ошибка сервера" });
};
