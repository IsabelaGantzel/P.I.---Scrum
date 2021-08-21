const db = require("../memory-database");

async function getClientId(personId) {
  for (const id in db.clients.entities) {
    if (db.clients.entities[id].person_id === personId) {
      return id;
    }
  }
  const [clientId] = await db.clients.insert({ person_id: personId });
  return clientId;
}

async function getManagerId(personId) {
  for (const id in db.managers.entities) {
    if (db.managers.entities[id].person_id === personId) {
      return id;
    }
  }
  const [clientId] = await db.managers.insert({ person_id: personId });
  return clientId;
}

module.exports = {
  async store(req, res) {
    const clientId = await getClientId(Number(req.body.clientId));
    const managerId = await getManagerId(Number(req.body.managerId));
    const projectData = {
      name: req.body.projectName,
      start_date: new Date(),
      final_date: null,
      manager_id: managerId,
      client_id: clientId,
    };

    const [projectId] = await db.projects.insert(projectData);

    await db.devs.insert(
      req.body.devIds.map((personId) => {
        return {
          project_id: projectId,
          person_id: personId,
        };
      })
    );

    res.json({
      id: projectId,
      ...projectData,
    });
  },
};
