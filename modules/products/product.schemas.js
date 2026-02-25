// modules/product/product.schemas.js
const { z } = require("zod");

const PRODUCT_STATUSES = ["draft", "active", "archived"];
const VARIANT_STATUSES = ["active", "hidden", "out_of_stock", "discontinued"];

const variantItemSchema = z.object({
  sku: z.string().trim().min(1, "sku обязателен"),
  price: z.coerce.number().positive("price должен быть > 0"),
  stock: z.coerce.number().int().min(0).optional().default(0),

  colorId: z.coerce.number().int().positive().optional().nullable(),

  size: z.string().trim().optional().nullable(),

  status: z.enum(VARIANT_STATUSES).optional().default("active"),

  mainImageIndex: z.coerce.number().int().min(0).optional().default(0),
});

const variantsSchema = z.preprocess(
  (val) => {
    if (typeof val === "string") {
      try {
        val = JSON.parse(val);
      } catch {
        return val;
      }
    }

    if (val && typeof val === "object" && !Array.isArray(val)) {
      return [val];
    }

    return val;
  },
  z
    .array(variantItemSchema)
    .min(1, "variants должен содержать хотя бы 1 вариант"),
);

const createProductBody = z.object({
  name: z.string().trim().min(2, "name слишком короткое"),
  description: z.string().trim().min(1, "description обязателен"),
  gender: z.enum(["women", "men", "unisex"]),

  categoryId: z.coerce.number().int().positive().optional().nullable(),
  status: z.enum(["draft", "active", "archived"]).optional().default("active"),

  variants: variantsSchema,
});

const updateProductBody = z
  .object({
    name: z.string().trim().min(2).optional(),
    description: z.string().trim().min(1).optional(),
    gender: z.enum(["women", "men", "unisex"]).optional(),

    categoryId: z.coerce.number().int().positive().optional().nullable(),
    status: z.enum(PRODUCT_STATUSES).optional(),
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "Нужно передать хотя бы одно поле",
  });

exports.createProductBody = createProductBody;
exports.updateProductBody = updateProductBody;

exports.getProductSchema = z.object({
  body: z.object({}).passthrough(),
  params: z.object({ productId: z.coerce.number().int().positive() }),
  query: z.object({}).passthrough(),
});

exports.createProductSchema = z.object({
  body: createProductBody,
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

exports.updateProductSchema = z.object({
  body: updateProductBody,
  params: z.object({
    productId: z.coerce.number().int().positive(),
  }),
  query: z.object({}).passthrough(),
});

exports.deleteProductSchema = z.object({
  body: z.object({}).passthrough(),
  params: z.object({
    productId: z.coerce.number().int().positive(),
  }),
  query: z.object({}).passthrough(),
});
