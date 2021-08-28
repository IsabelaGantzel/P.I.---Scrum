const isNil = require("./isNil");

function orDefault(value, defaultValue) {
  if (isNil(value)) {
    return defaultValue;
  } else {
    return value;
  }
}

module.exports = orDefault;
