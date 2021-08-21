const fs = require("fs");
const { knex } = require("knex");
const config = require("./config");
const knexfile = require("../../../knexfile");

const instance = knex(config);

module.exports = {
  instance,
  async createInstance() {
    await instance.migrate.latest(knexfile.migrations);
    await instance.seed.run(knexfile.seeds);
    return instance;
  },
  async dropInstance() {
    instance.destroy();
    fs.unlinkSync(config.connection.filename);
  },
};
