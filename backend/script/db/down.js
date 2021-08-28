const fs = require("fs");
const db = require("../../src/database/knex");
const config = require("../../src/database/knex/config");

async function run() {
  await db.query.destroy();
  fs.unlinkSync(config.connection.filename);
}

run();
