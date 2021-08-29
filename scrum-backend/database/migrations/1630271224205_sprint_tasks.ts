import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class SprintTasks extends BaseSchema {
  protected tableName = 'sprint_tasks'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('task_id').notNullable().references('id').inTable('tasks')
      table.integer('sprint_id').notNullable().references('id').inTable('sprints')
      table.integer('stage_id').notNullable().references('id').inTable('stages')

      // A task must be defined on a sprint only 1 time
      table.unique(['task_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
