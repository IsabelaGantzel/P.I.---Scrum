const TABLE_NAME = "sprints";

module.exports = {
  async up(knex) {
    return knex.schema.createTable(TABLE_NAME, (table) => {
      table.increments("id").primary();
      table.datetime("start_date").notNullable();
      table.datetime("final_date").notNullable();
    });
  },
  async down(knex) {
    return knex.schema.dropTable(TABLE_NAME);
  },
};
