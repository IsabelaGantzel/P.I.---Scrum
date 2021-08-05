const TABLE_NAME = "stages";

module.exports = {
  async up(knex) {
    return knex.schema.createTable(TABLE_NAME, (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
    });
  },
  async down(knex) {
    return knex.schema.dropTable(TABLE_NAME);
  },
};
