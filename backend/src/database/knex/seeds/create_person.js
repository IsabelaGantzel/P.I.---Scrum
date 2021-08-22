const passwordManager = require("../../../services/passwordManager");
const config = require("../../../config");
const { ADMIN_PASSWORD } = config;

module.exports = {
  async seed(knex) {
    // Only the admin can add new users
    const password = await passwordManager.hashPassword(ADMIN_PASSWORD);
    await knex("persons").insert([{ user: "admin", password }]);
  },
};
