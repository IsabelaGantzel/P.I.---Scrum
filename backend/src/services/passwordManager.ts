import bcrypt from "bcrypt";

// I change crypto to bcrypt because this: https://stackoverflow.com/questions/6951867/nodejs-bcrypt-vs-native-crypto
// npm bcrypt: https://www.npmjs.com/package/bcrypt

export function hashPassword(password: string | Buffer) {
  return bcrypt.hash(password, 12);
}

export function checkPassword(password: string | Buffer, signature: string) {
  return bcrypt.compare(password, signature);
}
