// modules/product-variant-images/image.openapi.js
const { z } = require("zod");
const { registry } = require("../../docs/swagger");
const {
  createImageSchema,
  deleteImageSchema,
  setMainImageSchema,
} = require("./image.schemas");

// маленькие хелперы, чтобы не писать простыни
function responsesBasic() {
  return {
    200: { description: "OK" },
    400: { description: "Validation error" },
    401: { description: "Unauthorized" },
    403: { description: "Forbidden" },
    404: { description: "Not found" },
  };
}

function multipart(schema) {
  return {
    content: {
      "multipart/form-data": { schema },
    },
  };
}

function pickReq(schema) {
  return {
    params: schema.shape.params,
    query: schema.shape.query,
    body: schema.shape.body,
  };
}

/**
 * POST /products/{productId}/variants/{variantId}/images
 * (по факту твой роутер монтируется так: /:variantId/images)
 * productId тут НЕ используется в image.schemas (и не обязан),
 * но в swagger path можно оставить только variantId.
 *
 * Если ты монтируешь images как:
 * /products/{productId}/variants/{variantId}/images
 * то мы укажем полный путь — это удобно в документации.
 */
{
  const { params } = pickReq(createImageSchema);

  registry.registerPath({
    method: "post",
    path: "/products/{productId}/variants/{variantId}/images",
    tags: ["Variant Images"],
    request: {
      params: z.object({
        productId: z.coerce.number().int().positive().openapi({ example: 1 }),
        // берём как у тебя в схеме
        variantId: params.shape.variantId.openapi({ example: 10 }),
      }),
      body: multipart(
        z.object({
          image: z.any().openapi({ type: "string", format: "binary" }),
        }),
      ),
    },
    responses: responsesBasic(),
  });
}

/**
 * PATCH /products/{productId}/variants/{variantId}/images/{imageId}
 * = setMain
 */
{
  const { params } = pickReq(setMainImageSchema);

  registry.registerPath({
    method: "patch",
    path: "/products/{productId}/variants/{variantId}/images/{imageId}",
    tags: ["Variant Images"],
    request: {
      params: z.object({
        productId: z.coerce.number().int().positive().openapi({ example: 1 }),
        variantId: params.shape.variantId.openapi({ example: 10 }),
        imageId: params.shape.imageId.openapi({ example: 55 }),
      }),
    },
    responses: responsesBasic(),
  });
}

/**
 * DELETE /products/{productId}/variants/{variantId}/images/{imageId}
 */
{
  const { params } = pickReq(deleteImageSchema);

  registry.registerPath({
    method: "delete",
    path: "/products/{productId}/variants/{variantId}/images/{imageId}",
    tags: ["Variant Images"],
    request: {
      params: z.object({
        productId: z.coerce.number().int().positive().openapi({ example: 1 }),
        variantId: params.shape.variantId.openapi({ example: 10 }),
        imageId: params.shape.imageId.openapi({ example: 55 }),
      }),
    },
    responses: responsesBasic(),
  });
}
