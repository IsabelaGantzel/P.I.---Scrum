import jwt from "jsonwebtoken";

const JWT_SECRET = "123mudar";
const JWT_EXPIRES_IN = 24 * 60 * 60; // 1 day

export function generateToken(data: string | object | Buffer) {
  const opts = {
    expiresIn: JWT_EXPIRES_IN,
  };
  return jwt.sign(data, JWT_SECRET, opts);
}

export function readToken(token: string) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err: any, result: unknown) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}
