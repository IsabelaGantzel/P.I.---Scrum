var jwt = require("jsonwebtoken");

const JWT_SECRET = "123mudar";
const JWT_EXPIRES_IN = 300; // 5 min

function generateToken(data) {
  return new Promise((resolve, reject) => {
    const opts = {
      expiresIn: JWT_EXPIRES_IN,
    };
    jwt.sign(data, JWT_SECRET, opts, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
}

function readToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

module.exports = { generateToken, readToken };
