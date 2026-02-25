function json(schema) {
  return {
    content: {
      "application/json": { schema },
    },
  };
}

function multipart(schema) {
  return {
    content: {
      "multipart/form-data": { schema },
    },
  };
}

function responsesBasic() {
  return {
    200: { description: "OK" },
    400: { description: "Validation error" },
    401: { description: "Unauthorized" },
    403: { description: "Forbidden" },
    404: { description: "Not found" },
  };
}

function pickReq(schema) {
  return {
    params: schema.shape.params,
    query: schema.shape.query,
    body: schema.shape.body,
  };
}

module.exports = { json, multipart, responsesBasic, pickReq };
