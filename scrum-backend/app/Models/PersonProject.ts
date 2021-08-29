import { column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import Project from 'App/Models/Project'
import Person from 'App/Models/Person'

export default class PersonProject extends Project {
  @column()
  public role: string

  @hasOne(() => Person, { foreignKey: 'person_id' })
  public person: HasOne<typeof Person>
}
