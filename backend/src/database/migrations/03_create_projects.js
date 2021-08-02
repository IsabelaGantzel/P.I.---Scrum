const TABLE_NAME = "projects";

module.exports = {
  async up(knex) {
    return knex.schema.createTable(TABLE_NAME, (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.datetime("start_date").notNullable();
      table.datetime("final_date").notNullable();
      table
        .integer("manager_id")
        .notNullable()
        .references("id")
        .inTable("managers");
      table
        .integer("client_id")
        .notNullable()
        .references("id")
        .inTable("clients");
    });
  },
  async down(knex) {
    return knex.schema.dropTable(TABLE_NAME);
  },
};
