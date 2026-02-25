const { z } = require("zod");
const { registry } = require("../../docs/swagger");
const {
  multipart,
  json,
  responsesBasic,
  pickReq,
} = require("../../docs/openapiHelpers");

const {
  createVariantSchema,
  updateVariantSchema,
  deleteVariantSchema,
  createVariantBody,
} = require("./variant.schemas");

// POST /products/{productId}/variants (multipart)
{
  const { params } = pickReq(createVariantSchema);

  registry.registerPath({
    method: "post",
    path: "/products/{productId}/variants",
    tags: ["Variants"],
    request: {
      params,
      body: multipart(
        createVariantBody.extend({
          images: z
            .array(z.any().openapi({ type: "string", format: "binary" }))
            .optional()
            .openapi({ description: "Фотографии варианта (multiple)" }),
        }),
      ),
    },
    responses: responsesBasic(),
  });
}

// PATCH /products/{productId}/variants/{variantId} (json)
{
  const { params, body } = pickReq(updateVariantSchema);

  registry.registerPath({
    method: "patch",
    path: "/products/{productId}/variants/{variantId}",
    tags: ["Variants"],
    request: { params, body: json(body) },
    responses: responsesBasic(),
  });
}

// DELETE /products/{productId}/variants/{variantId}
{
  const { params } = pickReq(deleteVariantSchema);

  registry.registerPath({
    method: "delete",
    path: "/products/{productId}/variants/{variantId}",
    tags: ["Variants"],
    request: { params },
    responses: responsesBasic(),
  });
}
