const {
  Product,
  ProductVariant,
  ProductVariantImage,
  Category,
  Color,
} = require("../../models/models");

const productInclude = [
  { model: Category, as: "category" },
  {
    model: ProductVariant,
    as: "variants",
    include: [
      { model: Color, as: "color" },
      { model: ProductVariantImage, as: "images" },
    ],
  },
];

const productOrder = [
  [{ model: ProductVariant, as: "variants" }, "id", "ASC"],

  [
    { model: ProductVariant, as: "variants" },
    { model: ProductVariantImage, as: "images" },
    "isMain",
    "DESC",
  ],

  [
    { model: ProductVariant, as: "variants" },
    { model: ProductVariantImage, as: "images" },
    "sortOrder",
    "ASC",
  ],

  [
    { model: ProductVariant, as: "variants" },
    { model: ProductVariantImage, as: "images" },
    "id",
    "ASC",
  ],
];

async function getProductById(id, options = {}) {
  return Product.findByPk(id, {
    include: productInclude,
    order: productOrder,
    ...options,
  });
}

async function getAllProducts(options = {}) {
  return Product.findAll({
    include: productInclude,
    order: productOrder,
    ...options,
  });
}

module.exports = {
  productInclude,
  productOrder,
  getProductById,
  getAllProducts,
};
