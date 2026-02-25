const { z } = require("zod");

const idSchema = z.coerce.number().int().positive();

exports.addCartItemSchema = z.object({
  body: z.object({
    variantId: idSchema,
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

exports.updateCartItemQuantitySchema = z.object({
  body: z.object({
    quantity: z.coerce
      .number()
      .int()
      .refine((v) => v === 1 || v === -1, {
        message: "quantity должен быть 1 или -1",
      }),
  }),
  params: z.object({
    itemId: idSchema,
  }),
  query: z.object({}).passthrough(),
});

exports.removeCartItemSchema = z.object({
  body: z.object({}).passthrough(),
  params: z.object({
    itemId: idSchema,
  }),
  query: z.object({}).passthrough(),
});
