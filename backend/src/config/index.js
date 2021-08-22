const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.join(__dirname, "..", "..", ".env"),
});

function requireNotNull(name) {
  const variable = process.env[name];
  if (variable === null || variable === undefined) {
    throw new Error(`Environment variable '${name}' can't be null!`);
  } else {
    return variable;
  }
}

const config = {
  PORT: requireNotNull("PORT"),
  ADMIN_PASSWORD: requireNotNull("ADMIN_PASSWORD"),
};

module.exports = config;
