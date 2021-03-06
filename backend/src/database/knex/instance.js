const { knex } = require("knex");

/**
 * Create a database interface of a knex connection
 *
 * @param {knex} query
 */
function instance(query) {
  const DAYS = 24 * 60 * 60 * 1000;
  let firstStageId = null;

  return {
    query,
    async insertDevs({ projectId, devIds }) {
      return Promise.all(
        devIds.map(async (personId) => {
          const [devId] = await query("devs").insert({
            project_id: projectId,
            person_id: personId,
          });
          return devId;
        })
      );
    },
    async insertProject(projectData) {
      const [projectId] = await query("projects").insert(projectData);
      return projectId;
    },
    async insertPerson(personData) {
      const [personId] = await query("persons").insert(personData);
      return personId;
    },
    async insertSprint() {
      const [sprintId] = await query("sprints").insert({
        start_date: Date.now(),
        final_date: Date.now() + 7 * DAYS,
      });
      return sprintId;
    },
    async insertTask(taskData) {
      const [taskId] = await query("tasks").insert(taskData);
      return taskId;
    },
    async insertTasksToSprint({ taskIds, sprintId }) {
      const firstStageId = await this.getFirstStage();
      await query("sprint_tasks").insert(
        taskIds.map((taskId) => ({
          task_id: taskId,
          sprint_id: sprintId,
          stage_id: firstStageId,
        }))
      );
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
            .join({ t: "tasks" }, "t.project_id", "=", "p2.id")
            .join({ st: "sprint_tasks" }, "st.task_id", "=", "t.id")
            .join({ s: "sprints" }, "st.sprint_id", "=", "s.id")
            .where("s.is_open", true)
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
          .select(
            "t.*",
            "s.start_date",
            "s.final_date",
            "s.is_open",
            query.raw("sg.name as stage")
          )
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
    async getFreeTasks({ taskIds, projectId }) {
      const tasks = await query
        .select("t.*", "st.sprint_id")
        .from({ t: "tasks" })
        .leftJoin({ st: "sprint_tasks" }, "st.task_id", "=", "t.id")
        .whereIn("t.id", taskIds)
        .andWhere("t.project_id", projectId);
      return tasks;
    },
    async getCurrentSprint({ projectId }) {
      const [sprint] = await query
        .select("s.*")
        .from({ p: "person_projects" })
        .leftJoin({ t: "tasks" }, "t.project_id", "=", "p.id")
        .leftJoin({ st: "sprint_tasks" }, "st.task_id", "=", "t.id")
        .leftJoin({ s: "sprints" }, "s.id", "=", "st.sprint_id")
        .where("p.id", projectId)
        .andWhere("s.is_open", true)
        .limit(1);
      return sprint || null;
    },
    async getFirstStage() {
      if (firstStageId === null) {
        const [stage] = await query
          .select()
          .from("stages")
          .where("name", "Started")
          .limit(1);
        firstStageId = stage.id;
      }
      return firstStageId;
    },
    async getTaskById({ taskId }) {
      const [task] = await query
        .select("t.*", "sg.name")
        .from({ t: "tasks" })
        .where("t.id", taskId)
        .join({ st: "sprint_tasks" }, "t.id", "=", "st.task_id")
        .join({ sg: "stages" }, "sg.id", "=", "st.stage_id")
      return task;
    },
    async getStageByName({ stageName }) {
      const [stage] = await query
        .select()
        .from("stages")
        .where("name", stageName)
        .limit(1)
      return stage;
    },
    async updateTaskStage({ taskId, stageId }) {
      const updateRolls = await query("sprint_tasks")
        .update({ stage_id: stageId })
        .where("task_id", taskId)
      return updateRolls;
    },
  };
}

module.exports = instance;
