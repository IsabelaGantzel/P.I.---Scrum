module.exports = (query) => {
  return {
    query,
    async insertDevs(devs) {
      return await query("devs").insert(devs);
    },
    async insertProject(projectData) {
      return await query("projects").insert(projectData);
    },
    async insertPerson(persons) {
      return await query("persons").insert(persons);
    },
    async getClient(personId) {
      const [person] = await query("persons").where("id", personId).select();
      if (!person) return null;

      const [client] = await query("clients")
        .where({ person_id: personId })
        .select();
      if (client) return client.id;
      const [clientId] = await query("clients").insert({
        person_id: personId,
      });
      return clientId;
    },
    async getManager(personId) {
      const [person] = await query("persons").where("id", personId).select();
      if (!person) return null;

      const [manager] = await query("managers")
        .where({ person_id: personId })
        .select();
      if (manager) return manager.id;
      const [managerId] = await query("managers").insert({
        person_id: personId,
      });
      return managerId;
    },
    async getPersonByName(userName) {
      const [person] = await query("persons")
        .where("user", userName)
        .limit(1)
        .select();
      if (!person) return null;
      return person;
    },
    async getProjects({ personId, page }) {
      const rawRole = (role) => query.raw('"' + role + '" as `role`');
      const projects = await query
        .select("p.*", "m.person_id", rawRole("manager"))
        .from({ p: "projects", m: "managers" })
        .where("m.person_id", personId)
        .andWhereRaw("p.manager_id = m.id")
        .union(function unionClient() {
          this.select("p.*", "c.person_id", rawRole("client"))
            .from({ p: "projects", c: "clients" })
            .where("c.person_id", personId)
            .andWhereRaw("p.client_id = c.id");
        })
        .union(function unionDev() {
          this.select("p.*", "d.person_id", rawRole("dev"))
            .from({ p: "projects", d: "devs" })
            .where("d.person_id", personId)
            .andWhereRaw("p.id = d.project_id");
        })
        .offset(page * 25)
        .limit(25);
      return projects;
    },
    async getProject({ projectId }) {
      const [project] = await query
        .select()
        .from("projects")
        .where("id", projectId);
      if (project) {
        const tasks = await query
          .select("t.*", "s.*", query.raw("sg.name as sprint"))
          .from({ t: "tasks" })
          .join({ st: "sprint_tasks" }, "t.id", "=", "st.task_id")
          .join({ s: "sprints" }, "s.id", "=", "st.sprint_id")
          .join({ sg: "stages" }, "sg.id", "=", "st.stage_id")
          .where("project_id", project.id);
        const [{ count }] = await query
          .count({ count: "sp.id" })
          .from({
            st: "sprint_tasks",
            p: "projects",
            t: "tasks",
            sp: "sprints",
          })
          .whereRaw(query.raw("p.id = t.project_id"))
          .andWhereRaw(query.raw("st.task_id = t.id"))
          .andWhereRaw(query.raw("st.sprint_id = sp.id"))
          .andWhere("p.id", projectId);
        return { ...project, tasks, sprint_count: count };
      } else {
        return null;
      }
    },
  };
};
