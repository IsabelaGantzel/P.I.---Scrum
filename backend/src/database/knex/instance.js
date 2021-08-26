module.exports = (query) => {
  return {
    query,
    async insertDevs({ projectId, devIds }) {
      return Promise.all(
        devIds.map(async (personId) => {
          const [devId] = query("devs").insert({
            project_id: projectId,
            person_id: personId,
          });
          return devId;
        })
      );
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
      const rawSum = query.raw("COUNT(s.sprint_id) as sprint_count");
      const projects = await query
        .select("p.*", "s.final_date as sprint_final_date", rawSum)
        .from({ p: "person_projects" })
        .leftJoin(
          query
            .select(
              query.raw(
                "DISTINCT s.id as sprint_id, p2.id as project_id, s.final_date"
              )
            )
            .from({ p2: "projects " })
            .leftJoin({ t: "tasks" }, "t.project_id", "=", "p2.id")
            .leftJoin({ st: "sprint_tasks" }, "st.task_id", "=", "t.id")
            .leftJoin({ s: "sprints" }, "st.sprint_id", "=", "s.id")
            .as("s"),
          "s.project_id",
          "p.id"
        )
        .where("p.person_id", personId)
        .groupBy("p.id")
        .offset(page * 25)
        .limit(25);
      return projects;
    },
    async getProject({ projectId, personId }) {
      const [project] = await query
        .select()
        .from("person_projects")
        .where("id", projectId)
        .andWhere("person_id", personId)
        .limit(1);
      if (project) {
        const tasks = await query
          .select("t.*", "s.*", query.raw("sg.name as stage"))
          .from({ t: "tasks" })
          .join({ st: "sprint_tasks" }, "t.id", "=", "st.task_id")
          .join({ s: "sprints" }, "s.id", "=", "st.sprint_id")
          .join({ sg: "stages" }, "sg.id", "=", "st.stage_id")
          .where("t.project_id", project.id);
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
    async getProjectById({ projectId, personId }) {
      const [project] = await query
        .select()
        .from({ p: "person_projects" })
        .where("p.id", projectId)
        .andWhere("person_id", personId)
        .limit(1);
      return project;
    },
    async getTasks({ projectId, page }) {
      const passedDate = "s.final_date < CURRENT_TIMESTAMP";
      const tasks = await query
        .select(
          "t.*",
          "s.start_date",
          "s.final_date",
          "s.is_open",
          query.raw("sg.name as stage")
        )
        .from({ t: "tasks" })
        .leftJoin({ st: "sprint_tasks" }, "t.id", "=", "st.task_id")
        .leftJoin({ s: "sprints" }, "s.id", "=", "st.sprint_id")
        .leftJoin({ sg: "stages" }, "sg.id", "=", "st.stage_id")
        .where("t.project_id", projectId)
        .andWhere(function withOutSprint() {
          this.whereNull("s.is_open").orWhere(function withOutSprintX() {
            this.where("s.is_open", false).andWhereRaw(passedDate);
          });
        })
        .offset(25 * page)
        .limit(25);
      return tasks;
    },
  };
};
