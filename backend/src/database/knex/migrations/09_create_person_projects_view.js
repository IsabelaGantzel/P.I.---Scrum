const VIEW_NAME = "person_projects";

module.exports = {
  up(knex) {
    return knex.raw(`CREATE VIEW ${VIEW_NAME} AS 
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
    WHERE p.id = d.project_id;`);
  },
  down(knex) {
    return knex.raw(`DROP VIEW ${VIEW_NAME}`);
  },
};
