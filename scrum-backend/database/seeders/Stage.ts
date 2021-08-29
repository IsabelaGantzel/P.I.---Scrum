import Database from '@ioc:Adonis/Lucid/Database'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

export default class StageSeeder extends BaseSeeder {
  public async run() {
    await Database.table('stages').insert([
      { name: 'Started' },
      { name: 'Doing' },
      { name: 'Testing' },
      { name: 'Reviewing' },
      { name: 'Complete' },
    ])
  }
}
