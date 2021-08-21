const path = require("path");

module.exports = {
  client: "sqlite3",
  connection: {
    filename: path.resolve(__dirname, "src", "database", "knex", "db.sqlite"),
  },
  migrations: {
    directory: path.resolve(__dirname, "src", "database", "knex", "migrations"),
  },
  seeds: {
    directory: path.resolve(__dirname, "src", "database", "knex", "seeds"),
  },
  useNullAsDefault: true,
};
