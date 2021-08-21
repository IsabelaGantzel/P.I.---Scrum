const jwtManager = require("../services/jwtManager");
const mockPersonId = 1231231;

module.exports = {
  async login(req, res) {
    try {
      // const person = await getPersonByName(req.body.userName);
      const token = jwtManager.generateToken({ personId: mockPersonId });
      res.json({
        token,
        message: "Login success!",
      });
    } catch (err) {
      console.log(err);
    }
  },
};
