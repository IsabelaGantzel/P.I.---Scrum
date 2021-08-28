const bcrypt = require("bcrypt");

// I change crypto to bcrypt because this: https://stackoverflow.com/questions/6951867/nodejs-bcrypt-vs-native-crypto
// npm bcrypt: https://www.npmjs.com/package/bcrypt

function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

function checkPassword(password, signature) {
  return bcrypt.compare(password, signature);
}

module.exports = {
  hashPassword,
  checkPassword,
};
