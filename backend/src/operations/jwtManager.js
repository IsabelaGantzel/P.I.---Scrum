var jwt = require("jsonwebtoken");

const JWT_SECRET = "123mudar";
const JWT_EXPIRES_IN = 24 * 60 * 60; // 1 day

function generateToken(data) {
  const opts = {
    expiresIn: JWT_EXPIRES_IN,
  };
  return jwt.sign(data, JWT_SECRET, opts);
}

function readToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { generateToken, readToken };
