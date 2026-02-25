const ApiError = require("../errors/ApiError");

module.exports = function requireUpload(opts = {}) {
  const { min = 1, field = null, message = null } = opts;

  return (req, _res, next) => {
    let files = [];

    if (req.file) {
      files = [req.file];
    } else if (Array.isArray(req.files)) {
      files = req.files;
    } else if (req.files && typeof req.files === "object") {
      files = field ? req.files[field] || [] : Object.values(req.files).flat();
    }

    if (field) {
      if (req.file && req.file.fieldname !== field) files = [];
      if (Array.isArray(req.files))
        files = req.files.filter((f) => f.fieldname === field);
    }

    if (files.length < min) {
      const msg =
        message ||
        (field
          ? `Нужно загрузить минимум ${min} файл(а) в поле "${field}"`
          : `Нужно загрузить минимум ${min} файл(а)`);
      return next(ApiError.badRequest(msg));
    }

    next();
  };
};
