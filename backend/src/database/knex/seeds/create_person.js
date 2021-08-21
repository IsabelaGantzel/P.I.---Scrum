const passwordManager = require("../../../services/passwordManager");
const ADMIN_PASSWORD = "123mudar";

module.exports = {
  async seed(knex) {
    // Only the admin can add new users
    // TODO: Update the password
    const password = await passwordManager.hashPassword(ADMIN_PASSWORD);
    await knex("persons").insert([{ user: "admin", password }]);
  },
};
