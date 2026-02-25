const { z } = require("zod");

const idSchema = z.coerce.number().int().positive();

const createColorBody = z.object({
  name: z.string().trim().min(1, "name обязателен"),
  hex: z.string().trim().min(1, "name обязателен"),
});

const updateColorBody = z
  .object({
    name: z.string().trim().min(1).optional(),
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "Нужно передать хотя бы одно поле",
  });

exports.createColorBody = createColorBody;
exports.updateColorBody = updateColorBody;

exports.createColorSchema = z.object({
  body: createColorBody,
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

exports.updateColorSchema = z.object({
  body: updateColorBody,
  params: z.object({ colorId: idSchema }),
  query: z.object({}).passthrough(),
});

exports.deleteColorSchema = z.object({
  params: z.object({ colorId: idSchema }),
});
