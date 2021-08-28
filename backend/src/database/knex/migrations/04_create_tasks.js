const TABLE_NAME = "tasks";

module.exports = {
  async up(knex) {
    return knex.schema.createTable(TABLE_NAME, (table) => {
      table.increments("id").primary();
      table.string("title").notNullable();
      table.string("description").notNullable();
      table.integer("points").notNullable();
      table
        .integer("project_id")
        .notNullable()
        .references("id")
        .inTable("projects");
    });
  },
  async down(knex) {
    return knex.schema.dropTable(TABLE_NAME);
  },
};
