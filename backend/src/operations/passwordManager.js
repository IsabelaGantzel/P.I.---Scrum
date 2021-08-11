const crypto = require("crypto");
const buffer = require("buffer");

// https://www.geeksforgeeks.org/node-js-crypto-verify-function/
// https://stackoverflow.com/questions/48611041/using-node-js-crypto-to-verify-signatures
const algorithm = "SHA256";
const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
});

function hashPassword(password) {
  return crypto
    .sign(algorithm, Buffer.from(password), privateKey)
    .toString("hex");
}

function checkPassword(password, signature) {
  return crypto.verify(
    algorithm,
    Buffer.from(password),
    publicKey,
    Buffer.from(signature, "hex")
  );
}

module.exports = {
  hashPassword,
  checkPassword,
};
