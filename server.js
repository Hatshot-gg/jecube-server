require("dotenv").config();
require("./models/models");
const sequelize = require("./db");

const app = require("./app");

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Server startes on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
