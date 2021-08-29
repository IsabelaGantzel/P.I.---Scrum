import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Clients extends BaseSchema {
  protected tableName = 'clients'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('person_id').notNullable().references('id').inTable('persons')
      // A person must be defined as client of projects only 1 time
      table.unique(['person_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
