const dotenv = require("dotenv");
const path = require("path");
const requireEnvNotNull = require("./requireEnvNotNull");

dotenv.config({
  path: path.join(__dirname, "..", "..", ".env"),
});

const config = {
  PORT: requireEnvNotNull("PORT"),
  ADMIN_PASSWORD: requireEnvNotNull("ADMIN_PASSWORD"),
  JWT_SECRET: requireEnvNotNull("JWT_SECRET"),
};

module.exports = config;
