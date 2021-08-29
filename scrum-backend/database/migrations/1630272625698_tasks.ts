import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Tasks extends BaseSchema {
  protected tableName = 'tasks'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string("title").notNullable()
      table.string("description").notNullable()
      table.integer("points").notNullable()
      table
        .integer("project_id")
        .notNullable()
        .references("id")
        .inTable("projects")
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
