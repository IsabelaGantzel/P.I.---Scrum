function _insert(table) {
  async function inserter(data) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(inserter));
    } else {
      const id = db[table].currentId++;
      db[table].entities[id] = { id, ...data };
      return [id];
    }
  }

  return inserter;
}

function _findById(table) {
  return async (id) => db[table].entities[id] || null;
}

function _table(table) {
  return {
    entities: {},
    currentId: 0,
    insert: _insert(table),
    findById: _findById(table),
  };
}

const db = Object.fromEntries(
  ["projects", "devs", "persons", "clients", "managers"].map((table) => [
    table,
    _table(table),
  ])
);

module.exports = db;
