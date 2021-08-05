const TABLE_NAME = "sprint_tasks";

module.exports = {
  async up(knex) {
    return knex.schema.createTable(TABLE_NAME, (table) => {
      table.integer("task_id").notNullable().references("id").inTable("tasks");
      table
        .integer("sprint_id")
        .notNullable()
        .references("id")
        .inTable("sprints");
      table
        .integer("stage_id")
        .notNullable()
        .references("id")
        .inTable("stages");

      // A task must be defined on a sprint only 1 time
      table.unique("task_id");
    });
  },
  async down(knex) {
    return knex.schema.dropTable(TABLE_NAME);
  },
};
