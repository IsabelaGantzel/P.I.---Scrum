import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import Person from 'App/Models/Person'

export default class Client extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @hasOne(() => Person, { foreignKey: 'person_id' })
  public person: HasOne<typeof Person>
}
