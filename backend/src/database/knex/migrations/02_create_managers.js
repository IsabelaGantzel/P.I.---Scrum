const TABLE_NAME = "managers";

module.exports = {
  async up(knex) {
    return knex.schema.createTable(TABLE_NAME, (table) => {
      table.increments("id").primary();
      table
        .integer("person_id")
        .notNullable()
        .references("id")
        .inTable("persons");
      // A person must be defined as manager of projects only 1 time
      table.unique(["person_id"]);
    });
  },
  async down(knex) {
    return knex.schema.dropTable(TABLE_NAME);
  },
};
