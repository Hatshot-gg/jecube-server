const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");

app.use("/uploads", require("express").static(path.resolve("uploads")));

const { setupSwagger } = require("./docs/swagger");
require("./docs/register");
setupSwagger(app);

const router = require("./routes");

const corsOptions = {
  origin: "https://jecube-client.vercel.app/",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", router);

module.exports = app;
