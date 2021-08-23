const dotenv = require("dotenv");
const path = require("path");
const requireEnvNotNull = require("./requireEnvNotNull");

dotenv.config({
  path: path.join(__dirname, "..", "..", ".env"),
});

const config = {
  PORT: requireEnvNotNull("PORT"),
  ADMIN_PASSWORD: requireEnvNotNull("ADMIN_PASSWORD"),
};

module.exports = config;
