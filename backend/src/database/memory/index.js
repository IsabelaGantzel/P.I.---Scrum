function _insert(table) {
  async function inserter(data) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(inserter));
    } else {
      const id = db.models[table].currentId++;
      db.models[table].entities[id] = { id, ...data };
      return [id];
    }
  }

  return inserter;
}

function _findById(table) {
  return async (id) => db.models[table].entities[id] || null;
}

function _table(table) {
  return {
    entities: {},
    currentId: 0,
    insert: _insert(table),
    findById: _findById(table),
  };
}

const models = Object.fromEntries(
  ["projects", "devs", "persons", "clients", "managers"].map((table) => [
    table,
    _table(table),
  ])
);

const db = {
  models,
  async insertProject(projectData) {
    return models.projects.insert(projectData);
  },
  async insertDevs(devs) {
    return models.devs.insert(devs);
  },
  async getClient(personId) {
    for (const id in db.models.clients.entities) {
      if (db.models.clients.entities[id].person_id === personId) {
        return id;
      }
    }
    const [clientId] = await db.models.clients.insert({ person_id: personId });
    return clientId;
  },
  async getManager(personId) {
    for (const id in db.models.managers.entities) {
      if (db.models.managers.entities[id].person_id === personId) {
        return id;
      }
    }
    const [clientId] = await db.models.managers.insert({ person_id: personId });
    return clientId;
  },
};

module.exports = db;
