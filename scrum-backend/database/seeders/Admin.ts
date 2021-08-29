import Database from '@ioc:Adonis/Lucid/Database'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Hash from '@ioc:Adonis/Core/Hash'
import Env from '@ioc:Adonis/Core/Env'

export default class AdminSeeder extends BaseSeeder {
  public async run() {
    const password = await Hash.make(Env.get('ADMIN_PASSWORD'))

    await Database.table('persons').insert({
      user: 'admin',
      password,
    })
  }
}
