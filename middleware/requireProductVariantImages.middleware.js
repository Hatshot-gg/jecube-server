const ApiError = require("../errors/ApiError");

function parseVariants(raw) {
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  if (Array.isArray(raw)) return raw;
  // если вдруг пришёл объект одного варианта (редко, но бывает)
  if (raw && typeof raw === "object") return [raw];
  return null;
}

module.exports = () => (req, _res, next) => {
  const variants = parseVariants(req.body?.variants);

  if (!Array.isArray(variants) || variants.length === 0) {
    return next(
      ApiError.badRequest("Ошибка валидации", [
        {
          path: "body.variants",
          message:
            "variants обязателен (массив) и должен содержать хотя бы 1 вариант",
        },
      ]),
    );
  }

  const files = req.files || [];

  // сгруппируем файлы по индексу варианта (лучше, чем по fieldname строкой)
  const filesByIndex = new Map();
  for (const f of files) {
    const m = f.fieldname?.match(/^variants\[(\d+)\]\[images\]$/);
    if (!m) continue;
    const idx = Number(m[1]);
    if (!filesByIndex.has(idx)) filesByIndex.set(idx, []);
    filesByIndex.get(idx).push(f);
  }

  const errors = [];

  for (let i = 0; i < variants.length; i++) {
    const arr = filesByIndex.get(i) || [];
    if (arr.length < 1) {
      errors.push({
        path: `body.variants.${i}.images`,
        message: "Добавьте минимум 1 фото для этого варианта",
      });
    }
  }

  if (errors.length) {
    return next(ApiError.badRequest("Ошибка валидации", errors));
  }

  next();
};
