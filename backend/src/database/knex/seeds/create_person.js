module.exports = {
  async seed(knex) {
    // Only the admin can add new users
    // TODO: Update the password
    await knex("persons").insert([{ user: "admin", password: "123mudar" }]);
  },
};
