import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Sprints extends BaseSchema {
  protected tableName = 'sprints'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.dateTime('start_date').notNullable()
      table.dateTime('final_date').notNullable()
      table.boolean('is_open').notNullable().defaultTo(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
