import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Sprint extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ columnName: 'start_date' })
  public startDate: DateTime

  @column.dateTime({ columnName: 'final_date' })
  public finalDate: DateTime
}
