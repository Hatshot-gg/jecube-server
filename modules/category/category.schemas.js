// modules/category/category.schemas.js
const { z } = require("zod");

const idSchema = z.coerce.number().int().positive();

const slugSchema = z
  .string()
  .trim()
  .min(1, "slug обязателен")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "slug должен быть в формате: my-category-1",
  )
  .openapi({ example: "krossovki" });

const createCategoryBody = z.object({
  name: z.string().trim().min(1, "name обязателен"),
  slug: slugSchema.optional(),
});

const updateCategoryBody = z
  .object({
    name: z.string().trim().min(1).optional(),
    slug: slugSchema.optional(),
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "Нужно передать хотя бы одно поле",
  });

exports.createCategoryBody = createCategoryBody;
exports.updateCategoryBody = updateCategoryBody;

exports.createCategorySchema = z.object({
  body: createCategoryBody,
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

exports.updateCategorySchema = z.object({
  body: updateCategoryBody,
  params: z.object({ categoryId: idSchema }),
  query: z.object({}).passthrough(),
});

exports.deleteCategorySchema = z.object({
  params: z.object({ categoryId: idSchema }),
});
