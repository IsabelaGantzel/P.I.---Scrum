const { knex } = require("knex");
const path = require("path");

module.exports = knex({
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
