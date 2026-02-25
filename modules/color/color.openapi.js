// modules/color/color.openapi.js
const { registry } = require("../../docs/swagger");
const { json, responsesBasic, pickReq } = require("../../docs/openapiHelpers");

const {
  updateColorSchema,
  deleteColorSchema,
  createColorBody,
} = require("./color.schemas");

// POST /colors
{
  registry.registerPath({
    method: "post",
    path: "/colors",
    tags: ["Colors"],
    request: {
      body: json(
        createColorBody.openapi({
          example: { name: "желтый", hex: "#fff" },
        }),
      ),
    },
    responses: responsesBasic(),
  });
}

// PATCH /colors/{colorId}
{
  const { params, body } = pickReq(updateColorSchema);

  registry.registerPath({
    method: "patch",
    path: "/colors/{colorId}",
    tags: ["Colors"],
    request: { params, body: json(body) },
    responses: responsesBasic(),
  });
}

// DELETE /colors/{colorId}
{
  const { params } = pickReq(deleteColorSchema);

  registry.registerPath({
    method: "delete",
    path: "/colors/{colorId}",
    tags: ["Colors"],
    request: { params },
    responses: responsesBasic(),
  });
}

// GET /colors
{
  registry.registerPath({
    method: "get",
    path: "/colors",
    tags: ["Colors"],
    responses: responsesBasic(),
  });
}
