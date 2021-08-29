const jwtManager = require("../services/jwtManager");
const passwordManager = require("../services/passwordManager");
const db = require("../database");
const isNil = require("../lib/isNil");

module.exports = {
  async login(req, res) {
    const person = await db.getPersonByName(req.body.userName);
    if (isNil(person)) {
      res.status(404).json({ error: "Person not found" });
    } else {
      const isPasswordCorrect = await passwordManager.checkPassword(
        req.body.password,
        person.password
      );

      if (!isPasswordCorrect) {
        res.status(400).json({ error: "User or password invalid" });
      } else {
        const token = jwtManager.generateToken({ personId: person.id });
        res.json({
          token,
          message: "Login success!",
        });
      }
    }
  },
};
