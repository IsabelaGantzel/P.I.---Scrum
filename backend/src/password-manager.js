const crypto = require("crypto");

const CRYPTO_SALT = "123mudar";

function hashPassword(password) {
  const hash = crypto.createHmac("sha512", CRYPTO_SALT);
  hash.update(password);
  return hash.digest("hex");
}

function checkPassword(password, hash) {
  crypto.verify("sha512", password, CRYPTO_SALT, hash);
}
