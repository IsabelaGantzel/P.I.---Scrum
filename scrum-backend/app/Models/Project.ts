import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import Manager from 'App/Models/Manager'
import Client from 'App/Models/Client'
import Dev from 'App/Models/Dev'

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column.dateTime({ columnName: 'start_date' })
  public startDate: DateTime

  @column.dateTime({ columnName: 'final_date' })
  public finalDate: DateTime

  @hasOne(() => Manager, { foreignKey: 'manager_id' })
  public manager: HasOne<typeof Manager>

  @hasOne(() => Client, { foreignKey: 'client_id' })
  public client: HasOne<typeof Client>

  @hasMany(() => Dev)
  public devs: HasMany<typeof Dev>
}
