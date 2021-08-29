import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Projects extends BaseSchema {
  protected tableName = 'projects'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.dateTime('start_date').notNullable()
      table.dateTime('final_date')
      table.integer('manager_id').notNullable().references('id').inTable('managers')
      table.integer('client_id').notNullable().references('id').inTable('clients')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
