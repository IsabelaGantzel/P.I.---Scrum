import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Project from './Project'

export default class Task extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public points: number

  @hasOne(() => Project)
  public project: HasOne<typeof Project>
}
