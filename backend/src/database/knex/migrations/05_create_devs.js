const TABLE_NAME = "devs";

module.exports = {
  async up(knex) {
    return knex.schema.createTable(TABLE_NAME, (table) => {
      table.increments("id").primary();
      table
        .integer("person_id")
        .notNullable()
        .references("id")
        .inTable("persons");
      table
        .integer("project_id")
        .notNullable()
        .references("id")
        .inTable("projects");

      // A person must be a dev on a project only 1 time
      table.unique(["person_id", "project_id"]);
    });
  },
  async down(knex) {
    return knex.schema.dropTable(TABLE_NAME);
  },
};
