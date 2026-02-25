const { z } = require("zod");
const { registry } = require("../../docs/swagger");
const { json, responsesBasic, pickReq } = require("../../docs/openapiHelpers");

const {
  addCartItemSchema,
  updateCartItemQuantitySchema,
  removeCartItemSchema,
} = require("./cart.schemas");

/**
 * GET /cart
 */
registry.registerPath({
  method: "get",
  path: "/cart",
  tags: ["Cart"],
  // если у тебя authMiddleware обязателен:
  security: [{ bearerAuth: [] }],
  responses: responsesBasic(),
});

/**
 * POST /cart/items
 */
{
  const { body } = pickReq(addCartItemSchema);

  registry.registerPath({
    method: "post",
    path: "/cart/items",
    tags: ["Cart"],
    security: [{ bearerAuth: [] }],
    request: {
      body: json(
        body.openapi({
          example: { variantId: 123 },
        }),
      ),
    },
    responses: responsesBasic(),
  });
}

/**
 * PATCH /cart/items/{itemId}
 */
{
  const { params, body } = pickReq(updateCartItemQuantitySchema);

  registry.registerPath({
    method: "patch",
    path: "/cart/items/{itemId}",
    tags: ["Cart"],
    security: [{ bearerAuth: [] }],
    request: {
      params,
      body: json(
        body.openapi({
          example: { quantity: 1 },
        }),
      ),
    },
    responses: responsesBasic(),
  });
}

/**
 * DELETE /cart/items/{itemId}
 */
{
  const { params } = pickReq(removeCartItemSchema);

  registry.registerPath({
    method: "delete",
    path: "/cart/items/{itemId}",
    tags: ["Cart"],
    security: [{ bearerAuth: [] }],
    request: { params },
    responses: responsesBasic(),
  });
}
