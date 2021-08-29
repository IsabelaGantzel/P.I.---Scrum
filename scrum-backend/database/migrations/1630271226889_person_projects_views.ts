import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PersonProjectsViews extends BaseSchema {
  protected viewName = 'person_projects'

  public async up() {
    this.raw(`CREATE VIEW ${this.viewName} AS 
    SELECT "manager" as \`role\`, p.*, m.person_id
    FROM projects p, managers m  
    WHERE p.manager_id = m.id
    UNION 
    SELECT "client" as \`role\`, p.*, c.person_id
    FROM projects p, clients c  
    WHERE p.client_id = c.id
    UNION 
    SELECT "dev" as \`role\`, p.*, d.person_id
    FROM projects p, devs d  
    WHERE p.id = d.project_id;`)
  }

  public async down() {
    this.raw(`DROP VIEW ${this.viewName}`)
  }
}
