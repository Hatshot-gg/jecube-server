// modules/category/category.openapi.js
const { registry } = require("../../docs/swagger");
const { json, responsesBasic, pickReq } = require("../../docs/openapiHelpers");

const {
  updateCategorySchema,
  deleteCategorySchema,
  createCategoryBody,
} = require("./category.schemas");

// POST /categories
{
  registry.registerPath({
    method: "post",
    path: "/categories",
    tags: ["Categories"],
    request: {
      body: json(
        createCategoryBody.openapi({
          example: { name: "Кроссовки", slug: "krossovki" },
        }),
      ),
    },
    responses: responsesBasic(),
  });
}

// PATCH /categories/{categoryId}
{
  const { params, body } = pickReq(updateCategorySchema);

  registry.registerPath({
    method: "patch",
    path: "/categories/{categoryId}",
    tags: ["Categories"],
    request: { params, body: json(body) },
    responses: responsesBasic(),
  });
}

// DELETE /categories/{categoryId}
{
  const { params } = pickReq(deleteCategorySchema);

  registry.registerPath({
    method: "delete",
    path: "/categories/{categoryId}",
    tags: ["Categories"],
    request: { params },
    responses: responsesBasic(),
  });
}

// GET /categories
{
  registry.registerPath({
    method: "get",
    path: "/categories",
    tags: ["Categories"],
    responses: responsesBasic(),
  });
}
