const fs = require("fs");
const { knex } = require("knex");
const config = require("./config");
const knexfile = require("../../../knexfile");
const instance = require("../../../src/database/knex/instance");

const testKnex = knex(config);

module.exports = {
  instance: instance(testKnex),
  async createInstance() {
    await testKnex.migrate.latest(knexfile.migrations);
    await testKnex.seed.run(knexfile.seeds);
    return testKnex;
  },
  async dropInstance() {
    for (let i = 0; i < 10; i++) {
      await testKnex.migrate.down(knexfile.migrations);
    }
    await testKnex.destroy();
    fs.unlinkSync(config.connection.filename);
  },
};
