const {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} = require("@asteasolutions/zod-to-openapi");

const { z } = require("zod");
const { extendZodWithOpenApi } = require("@asteasolutions/zod-to-openapi");

extendZodWithOpenApi(z);

const swaggerUi = require("swagger-ui-express");

const registry = new OpenAPIRegistry();

function generateOpenAPI() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  const doc = generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "Shop API",
      version: "1.0.0",
    },
    servers: [{ url: "http://localhost:5001" }],
  });

  // ✅ ДОПИСЫВАЕМ СЕКЬЮРИТИ СХЕМУ ВРУЧНУЮ
  doc.components = doc.components || {};
  doc.components.securitySchemes = {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
  };

  // ✅ ГЛОБАЛЬНОЕ ТРЕБОВАНИЕ ТОКЕНА (можно убрать и ставить per-route)
  doc.security = [{ bearerAuth: [] }];

  return doc;
}

function setupSwagger(app) {
  const doc = generateOpenAPI();
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(doc, {
      swaggerOptions: {
        tagsSorter: "alpha",
        operationsSorter: (a, b) => {
          const order = { get: 1, post: 2, patch: 3, put: 4, delete: 5 };
          const m1 = a.get("method").toLowerCase();
          const m2 = b.get("method").toLowerCase();
          return (order[m1] ?? 99) - (order[m2] ?? 99);
        },
      },
    }),
  );
}

module.exports = { z, registry, setupSwagger };
