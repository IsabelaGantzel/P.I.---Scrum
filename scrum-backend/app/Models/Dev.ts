import { BaseModel, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import Person from 'App/Models/Person'
import Project from './Project'

export default class Dev extends BaseModel {
  @belongsTo(() => Person, { foreignKey: 'person_id' })
  public person: BelongsTo<typeof Person>

  @belongsTo(() => Project, { foreignKey: 'project_id' })
  public projects: BelongsTo<typeof Project>
}
