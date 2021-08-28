const TABLE_NAME = "persons";

module.exports = {
  async up(knex) {
    return knex.schema.createTable(TABLE_NAME, (table) => {
      table.increments("id").primary();
      table.string("user").unique().notNullable();
      table.string("password").notNullable();
    });
  },
  async down(knex) {
    return knex.schema.dropTable(TABLE_NAME);
  },
};
