import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Person extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user: string

  @column()
  public password: string
}
