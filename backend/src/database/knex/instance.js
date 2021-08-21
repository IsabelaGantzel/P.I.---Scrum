module.exports = (query) => {
  return {
    query,
    async insertDevs(devs) {
      return await query("devs").insert(devs);
    },
    async insertProject(projectData) {
      return await query("projects").insert(projectData);
    },
    async getClient(personId) {
      const [client] = await query("clients").where({ person_id: personId });
      return client.id;
    },
    async getManager(personId) {
      const [manager] = await query("managers").where({ person_id: personId });
      return manager.id;
    },
  };
};
