import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Managers extends BaseSchema {
  protected tableName = 'managers'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('person_id').notNullable().references('id').inTable('persons')
      // A person must be defined as manager of projects only 1 time
      table.unique(['person_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
