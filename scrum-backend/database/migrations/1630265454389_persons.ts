import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Persons extends BaseSchema {
  protected tableName = 'persons'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('user').unique().notNullable()
      table.string('password').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
