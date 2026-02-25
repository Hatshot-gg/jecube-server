const ApiError = require("../errors/ApiError");

module.exports = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    const errors = result.error.issues.map((i) => ({
      path: i.path.join("."),
      message: i.message,
    }));
    return next(ApiError.badRequest("Ошибка валидации", errors));
  }

  req.body = result.data.body;
  req.params = result.data.params;
  req.query = result.data.query;

  return next();
};
