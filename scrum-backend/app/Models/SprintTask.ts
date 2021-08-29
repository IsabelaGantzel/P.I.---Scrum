import { BaseModel, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Task from 'App/Models/Task'
import Sprint from 'App/Models/Sprint'
import Stage from 'App/Models/Stage'

export default class SprintTask extends BaseModel {
  @hasOne(() => Task)
  public task: HasOne<typeof Task>

  @hasOne(() => Sprint)
  public sprint: HasOne<typeof Sprint>

  @hasOne(() => Stage)
  public stage: HasOne<typeof Stage>
}
