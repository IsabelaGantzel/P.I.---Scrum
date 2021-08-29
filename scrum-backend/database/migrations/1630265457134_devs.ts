import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Devs extends BaseSchema {
  protected tableName = 'devs'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('person_id').notNullable().references('id').inTable('persons')
      table.integer('project_id').notNullable().references('id').inTable('projects')

      // A person must be a dev on a project only 1 time
      table.unique(['person_id', 'project_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
