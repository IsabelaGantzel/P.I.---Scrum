const jwtManager = require("../services/jwtManager");
const passwordManager = require("../services/passwordManager");
const db = require("../database");

module.exports = {
  async login(req, res) {
    const person = await db.getPersonByName(req.body.userName);
    if (!person) {
      res.status(404).json({ error: "Person not found" });
    } else {
      const passwordCorrect = await passwordManager.checkPassword(
        req.body.password,
        person.password
      );

      if (!passwordCorrect) {
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
