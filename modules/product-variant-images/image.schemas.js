const { z } = require("zod");

const idSchema = z.coerce.number().int().positive();

exports.createImageSchema = z.object({
  body: z.object({}).passthrough(),
  params: z.object({ variantId: idSchema }),
  query: z.object({}).passthrough(),
});

exports.deleteImageSchema = z.object({
  body: z.object({}).passthrough(),
  params: z.object({ variantId: idSchema, imageId: idSchema }),
  query: z.object({}).passthrough(),
});

exports.setMainImageSchema = z.object({
  params: z.object({ variantId: idSchema, imageId: idSchema }),
});
