const { knex } = require("knex");
const path = require("path");

const query = knex({
  client: "sqlite3",
  connection: {
    filename: path.join(__dirname, "db.sqlite"),
  },
  pool: {
    afterCreate(connection, done) {
      connection.run("PRAGMA foreign_keys = ON", done);
    },
  },
  useNullAsDefault: true,
});

module.exports = {
  query,
  async insertDevs(devs) {
    return await query("devs").insert(devs);
  },
  async insertProject(projectData) {
    return await query("projects").insert(projectData);
  },
  async getClient(personId) {
    const [client] = await query("clients").where({ person_id: personId });
    return client.id;
  },
  async getManager(personId) {
    const [manager] = await query("managers").where({ person_id: personId });
    return manager.id;
  },
};
