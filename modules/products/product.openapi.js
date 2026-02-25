// modules/product/product.openapi.js
const { z } = require("zod");
const { registry } = require("../../docs/swagger");
const {
  multipart,
  json,
  responsesBasic,
  pickReq,
} = require("../../docs/openapiHelpers");

const {
  updateProductSchema,
  createProductBody,
  deleteProductSchema,
  getProductSchema,
} = require("./product.schemas");

// POST /products (multipart): variants + variantImages[i] + ...
{
  registry.registerPath({
    method: "post",
    path: "/products",
    tags: ["Products"],
    request: {
      body: multipart(
        createProductBody
          .extend({
            variants: z.string().openapi({
              description: "JSON-строка массива variants",
              example: `[
                        {"sku":"aaa","price":1,"stock":0,"colorId":1,"size":"string","mainImageIndex":0},
                        {"sku":"stradading","price":1,"stock":0,"colorId":1,"size":"string","mainImageIndex":0}
                        ]`,
            }),
            "variants[0][images]": z
              .array(z.any().openapi({ type: "string", format: "binary" }))
              .optional(),
            "variants[1][images]": z
              .array(z.any().openapi({ type: "string", format: "binary" }))
              .optional(),
          })

          .openapi({
            description:
              'Создание продукта с вариантами. Поле "variants" можно передавать JSON строкой. Файлы: variantImages[0], variantImages[1]... (по индексу варианта).',
          }),
      ),
    },
    responses: responsesBasic(),
  });
}

// PATCH /products/{productId} (json)

{
  const { params, body } = pickReq(updateProductSchema);

  registry.registerPath({
    method: "patch",
    path: "/products/{productId}",
    tags: ["Products"],
    request: {
      params,
      body: json(body),
    },
    responses: responsesBasic(),
  });
}

// GET / products;
{
  registry.registerPath({
    method: "get",
    path: "/products",
    tags: ["Products"],
    responses: responsesBasic(),
  });
}

// GET / products / { productId };
{
  const { params } = pickReq(getProductSchema);

  registry.registerPath({
    method: "get",
    path: "/products/{productId}",
    tags: ["Products"],
    request: {
      params,
    },
    responses: responsesBasic(),
  });
}

{
  const { params } = pickReq(deleteProductSchema);

  registry.registerPath({
    method: "delete",
    path: "/products/{productId}",
    tags: ["Products"],
    request: { params },
    responses: responsesBasic(),
  });
}
