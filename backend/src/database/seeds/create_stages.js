module.exports = async function seed(knex) {
  await knex("stages").insert([
    { name: "Started" },
    { name: "Doing" },
    { name: "Testing" },
    { name: "Reviewing" },
    { name: "Complete" },
  ]);
};
