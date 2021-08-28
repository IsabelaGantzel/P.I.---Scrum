const knexfile = require("../../knexfile");
const db = require("../../src/database/knex");

async function run() {
  await db.query.migrate.latest(knexfile.migrations);
  await db.query.seed.run(knexfile.seeds);
  await db.query.destroy();
}

run();
