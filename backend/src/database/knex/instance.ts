import { Knex } from "knex";

export function instance(query: Knex) {
  const DAYS = 24 * 60 * 60 * 1000;
  let firstStageId: number | null = null;

  return {
    query,
    async insertDevs({ projectId, devIds }: { projectId: number, devIds: number[] }) {
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
    async insertProject(projectData: any) {
      const [projectId] = await query("projects").insert(projectData);
      return projectId;
    },
    async insertPerson(personData: any) {
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
    async insertTask(taskData: any) {
      const [taskId] = await query("tasks").insert(taskData);
      return taskId;
    },
    async insertTasksToSprint({ taskIds, sprintId }: { taskIds: number[], sprintId: number }) {
      const firstStageId = await this.getFirstStage();
      await query("sprint_tasks").insert(
        taskIds.map((taskId) => ({
          task_id: taskId,
          sprint_id: sprintId,
          stage_id: firstStageId,
        }))
      );
    },
    async getClient(personId: number) {
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
    async getManager(personId: number) {
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
    async getPersonByName(userName: string) {
      const [person] = await query("persons")
        .where("user", userName)
        .limit(1)
        .select();
      if (!person) return null;
      return person;
    },
    async getProjects({ personId, page }: { personId: number, page: number }) {
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
    async getProject({ projectId, personId }: { projectId: number, personId: number }) {
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
    async getProjectById({ projectId, personId }: { projectId: number, personId: number }) {
      const [project] = await query
        .select()
        .from({ p: "person_projects" })
        .where("p.id", projectId)
        .andWhere("person_id", personId)
        .limit(1);
      return project;
    },
    async getTasks({ projectId, page }: { projectId: number, page: number }) {
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
    async getFreeTasks({ taskIds, projectId }: { projectId: number, taskIds: number[] }) {
      const tasks = await query
        .select("t.*", "st.sprint_id")
        .from({ t: "tasks" })
        .leftJoin({ st: "sprint_tasks" }, "st.task_id", "=", "t.id")
        .whereIn("t.id", taskIds)
        .andWhere("t.project_id", projectId);
      return tasks;
    },
    async getCurrentSprint({ projectId }: { projectId: number }) {
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
  };
};
