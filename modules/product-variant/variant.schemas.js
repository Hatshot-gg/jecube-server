// modules/product-variant/variant.schemas.js
const { z } = require("zod");

const idSchema = z.coerce.number().int().positive();

const VARIANT_STATUSES = ["active", "hidden", "out_of_stock", "discontinued"];

const createVariantBody = z.object({
  sku: z.string().trim().min(1, "sku обязателен"),
  price: z.coerce.number().positive("price должен быть > 0"),
  stock: z.coerce.number().int().min(0).optional().default(0),

  // было color: string
  colorId: z.coerce.number().int().positive().optional().nullable(),

  size: z.string().trim().optional().nullable(),

  status: z.enum(VARIANT_STATUSES).optional().default("active"),

  mainImageIndex: z.coerce.number().int().min(0).optional().default(0),
});

const updateVariantBody = z
  .object({
    sku: z.string().trim().min(1).optional(),
    price: z.coerce.number().positive().optional(),
    stock: z.coerce.number().int().min(0).optional(),

    colorId: z.coerce.number().int().positive().optional().nullable(),

    status: z.enum(VARIANT_STATUSES).optional(),

    size: z.string().trim().optional().nullable(),
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "Нужно передать хотя бы одно поле",
  });

exports.createVariantBody = createVariantBody;
exports.updateVariantBody = updateVariantBody;

exports.createVariantSchema = z.object({
  body: createVariantBody,
  params: z.object({ productId: idSchema }),
  query: z.object({}).passthrough(),
});

exports.updateVariantSchema = z.object({
  body: updateVariantBody,
  params: z.object({ productId: idSchema, variantId: idSchema }),
  query: z.object({}).passthrough(),
});

exports.deleteVariantSchema = z.object({
  params: z.object({ productId: idSchema, variantId: idSchema }),
});
