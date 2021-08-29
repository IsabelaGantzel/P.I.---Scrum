const {
  beforeAll,
  afterAll,
  afterEach,
  describe,
  expect,
  test,
} = require("@jest/globals");

describe("Memory Database", () => {
  const db = require("../../src/database/memory");

  test(`db.insertDevs() must returns an array of ids`, async () => {
    const result = await db.insertDevs([{ x: 123 }]);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(0);
  });
  test(`db.insertProject() must returns an array of ids`, async () => {
    const result = await db.insertProject([{ x: 123 }]);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(0);
  });

  describe("Invariant selection", () => {
    afterEach(() => {
      db.models.persons.entities = {};
      db.models.persons.currentId = 0;
    });

    test(`db.getClient() must returns null`, async () => {
      const id = await db.getClient(0);
      expect(id).toBeNull();
    });
    test(`db.getManager() must returns null`, async () => {
      const id = await db.getManager(0);
      expect(id).toBeNull();
    });

    // When called more then once, must return the same id
    test(`db.getClient() must returns an id`, async () => {
      await db.models.persons.insert({
        user: "user-0",
        password: "123",
      });
      const firstId = await db.getClient(0);
      expect(firstId).not.toBeNull();
      const secondId = await db.getClient(0);
      expect(firstId).toBe(secondId);
    });
    test(`db.getManager() must returns an id`, async () => {
      await db.models.persons.insert({
        user: "user-0",
        password: "123",
      });
      const firstId = await db.getManager(0);
      expect(firstId).not.toBeNull();
      const secondId = await db.getManager(0);
      expect(firstId).toBe(secondId);
    });
  });
});

describe("Knex Database", () => {
  const knex = require("./knex");
  const db = knex.instance;

  beforeAll(async () => {
    await knex.createInstance();
  });
  afterAll(async () => {
    await knex.dropInstance();
  }, 20000);

  const DAYS = 24 * 60 * 60 * 1000;
  let id = 100;
  let data = {
    clientPersonId: 0,
    managerPersonId: 0,
    managerId: 0,
    clientId: 0,
    projectId1: 0,
    taskId1: 0,
    projectId2: 0,
    taskId2: 0,
    sprintId: 0,
    stageId: 0,
  };
  beforeAll(async () => {
    const [clientPersonId] = await db.query("persons").insert({
      user: "client-0",
      password: "123",
    });
    const [clientId] = await db.query("clients").insert({
      person_id: clientPersonId,
    });
    const [managerPersonId] = await db.query("persons").insert({
      user: "manager-0",
      password: "123",
    });
    const [managerId] = await db.query("managers").insert({
      person_id: managerPersonId,
    });
    const [projectId1] = await db.query("projects").insert({
      name: "project-0",
      start_date: Date.now(),
      final_date: Date.now() + 30 + DAYS,
      manager_id: managerId,
      client_id: clientId,
    });
    const [taskId1] = await db.query("tasks").insert({
      title: "test-0",
      description: "desc",
      points: 100,
      project_id: projectId1,
    });
    const [projectId2] = await db.query("projects").insert({
      name: "project-0",
      start_date: Date.now(),
      final_date: Date.now() + 30 + DAYS,
      manager_id: managerId,
      client_id: clientId,
    });
    const [taskId2] = await db.query("tasks").insert({
      title: "test-0",
      description: "desc",
      points: 100,
      project_id: projectId2,
    });
    const [sprintId] = await db.query("sprints").insert({
      start_date: Date.now(),
      final_date: Date.now() + 7 * DAYS,
    });
    const [stage] = await db.query
      .select()
      .from("stages")
      .where("name", "Started")
      .limit(1);
    await db.query("sprint_tasks").insert({
      stage_id: stage.id,
      task_id: taskId2,
      sprint_id: sprintId,
    });

    data = {
      clientPersonId,
      managerPersonId,
      managerId,
      clientId,
      projectId1,
      taskId1,
      projectId2,
      taskId2,
      sprintId,
      stageId: stage.id,
    };
  });

  test("db.insertPerson() must return an id", async () => {
    const currentId = id++;
    const personId = await db.insertPerson({
      id: currentId,
      user: "fake",
      password: "123",
    });
    expect(personId).toBe(currentId);
  });
  test("db.insertDevs() must returns an id", async () => {
    const devsId = await db.insertDevs({
      projectId: data.projectId1,
      devIds: [data.managerPersonId],
    });
    expect(Array.isArray(devsId)).toBe(true);
    expect(devsId).toHaveLength(1);
  });
  test("db.insertProject() must returns an id", async () => {
    const currentId = id++;
    const projectId = await db.insertProject({
      id: currentId,
      name: "fake",
      start_date: Date.now(),
      final_date: Date.now() + 30 * DAYS,
      client_id: data.clientId,
      manager_id: data.managerId,
    });
    expect(projectId).toBe(currentId);
  });
  test("db.insertSprint() must returns an id", async () => {
    const sprintId = await db.insertSprint();
    expect(typeof sprintId === "number").toBe(true);
  });
  test("db.insertTask() must returns an id", async () => {
    const currentId = id++;
    const taskId = await db.insertTask({
      id: currentId,
      title: "test",
      description: "desc",
      points: 100,
      project_id: data.projectId2,
    });
    expect(taskId).toBe(currentId);
  });
  test("db.insertTasksToSprint() must link tasks with sprint", async () => {
    const [taskId] = await db.query("tasks").insert({
      title: "test",
      description: "desc",
      points: 1000,
      project_id: data.projectId2,
    });
    await db.insertTasksToSprint({
      taskIds: [taskId],
      sprintId: data.sprintId,
    });
    const result = await db.query
      .select()
      .from({ s: "sprints" })
      .join({ st: "sprint_tasks" }, "st.sprint_id", "=", "s.id")
      .join({ t: "tasks" }, "st.task_id", "=", "t.id")
      .where("s.id", data.sprintId)
      .andWhere("t.id", taskId);
    expect(result).toHaveLength(1);
  });

  describe("Invariant selection", () => {
    test("db.getClient() must returns null if person not exists", async () => {
      const id = await db.getClient(-1);
      expect(id).toBeNull();
    });
    test("db.getManager() must returns null if person not exists", async () => {
      const id = await db.getManager(-1);
      expect(id).toBeNull();
    });

    // When called more then once, must return the same id
    test(`db.getClient() must returns an id`, async () => {
      const [clientPersonId] = await db.query("persons").insert({
        user: "user-0",
        password: "123",
      });
      const firstId = await db.getClient(clientPersonId);
      expect(firstId).not.toBeNull();
      const secondId = await db.getClient(clientPersonId);
      expect(firstId).toBe(secondId);
    });
    test(`db.getManager() must returns an id`, async () => {
      const [clientPersonId] = await db.query("persons").insert({
        user: "user-1",
        password: "123",
      });
      const firstId = await db.getManager(clientPersonId);
      expect(firstId).not.toBeNull();
      const secondId = await db.getManager(clientPersonId);
      expect(firstId).toBe(secondId);
    });
  });

  test("db.getProject() must return a complete project", async () => {
    const project = await db.getProject({
      projectId: data.projectId1,
      personId: data.clientPersonId,
    });
    expect(project).not.toBeNull();
    expect(project).toHaveProperty("id", data.projectId1);
    expect(project).toHaveProperty("name");
    expect(project).toHaveProperty("start_date");
    expect(project).toHaveProperty("final_date");
    expect(project).toHaveProperty("manager_id");
    expect(project).toHaveProperty("client_id");
    expect(project).toHaveProperty("sprint_count", 0);
    expect(project).toHaveProperty("tasks");
    expect(project.tasks).toHaveLength(0);
  });
  test("db.getProject() must return null if project not exists", async () => {
    const project = await db.getProject({
      projectId: -1,
      personId: data.clientPersonId,
    });
    expect(project).toBeNull();
  });
  test("db.getProjects() must return an array of projects", async () => {
    const projects = await db.getProjects({
      personId: data.clientPersonId,
      page: 0,
    });
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length >= 1).toBe(true);

    projects.forEach((project) => {
      expect(project).toHaveProperty("name");
      expect(project).toHaveProperty("final_date");
      expect(project).toHaveProperty("start_date");
      expect(project).toHaveProperty("client_id");
      expect(project).toHaveProperty("manager_id");
      expect(project).toHaveProperty("person_id");
      expect(project).toHaveProperty("role");
      expect(project).toHaveProperty("sprint_count");
    });
  });
  test("db.getTasks() must return an array of tasks", async () => {
    const tasks = await db.getTasks({ projectId: data.projectId1, page: 0 });
    expect(Array.isArray(tasks)).toBe(true);
    expect(tasks.length >= 1).toBe(true);

    tasks.forEach((task) => {
      expect(task).toHaveProperty("title");
      expect(task).toHaveProperty("description");
      expect(task).toHaveProperty("points");
      expect(task).toHaveProperty("project_id");
      expect(task).toHaveProperty("stage");
      expect(task).toHaveProperty("start_date");
      expect(task).toHaveProperty("final_date");
      expect(task).toHaveProperty("is_open");
    });
  });

  test("db.getProjectById() must be of a specific person", async () => {
    const project1 = await db.getProjectById({
      projectId: data.projectId1,
      personId: data.clientPersonId,
    });
    const project2 = await db.getProjectById({
      projectId: data.projectId1,
      personId: data.managerPersonId,
    });

    expect(project1.person_id).not.toBe(project2.person_id);
  });
  test("db.getProjectById() must return a project, but not as db.getProject()", async () => {
    const project = await db.getProjectById({
      projectId: data.projectId1,
      personId: data.clientPersonId,
    });
    expect(project).not.toBeNull();
    expect(project).not.toHaveProperty("tasks");
    expect(project).not.toHaveProperty("sprint_count");
  });
  test("db.getPersonByName() must return a person by userName", async () => {
    const person = await db.getPersonByName("client-0");
    expect(person).not.toBeNull();
  });
  test("db.getPersonByName() must return null if userName was not found", async () => {
    const project = await db.getPersonByName("undefined-user");
    expect(project).toBeNull();
  });

  test("db.insertPerson() must insert a person", async () => {
    const userName = "test-user";
    const personId = await db.insertPerson({
      user: userName,
      password: "1234",
    });
    expect(personId).not.toBeNull();
    expect(typeof personId === "number").toBe(true);

    const person = await db.getPersonByName(userName);
    expect(person).toHaveProperty("id", personId);
    expect(person).toHaveProperty("user", userName);
  });

  test("db.getFirstStage() must return the same number", async () => {
    const stageId1 = await db.getFirstStage();
    const stageId2 = await db.getFirstStage();

    expect(stageId1).not.toBeNull();
    expect(stageId1).toBe(stageId2);
  });

  test("db.getCurrentSprint() must return null is not exists", async () => {
    const sprint = await db.getCurrentSprint({ projectId: data.projectId1 });
    expect(sprint).toBeNull();
  });
  test("db.getCurrentSprint() must return a object if exists", async () => {
    const sprint = await db.getCurrentSprint({ projectId: data.projectId2 });
    expect(sprint).not.toBeNull();
    expect(sprint.id).toBe(data.sprintId);
  });
  test("db.getFreeTasks() must return an array of tasks", async () => {
    const tasks = await db.getFreeTasks({
      projectId: data.projectId1,
      taskIds: [data.taskId1],
    });
    expect(Array.isArray(tasks)).toBe(true);
    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toHaveProperty("id", data.taskId1);
  });

  test("db.getTaskById() must return a task", async () => {
    const task = await db.getTaskById({ taskId: data.taskId1 });
    expect(task).not.toBeNull();
  });
  test("db.updateTaskStage() must return a task", async () => {
    const updatedRows = await db.updateTaskStage({
      taskId: data.taskId2,
      stageId: data.stageId,
    });
    expect(updatedRows).toBe(1);
  });
  test("db.updateTaskStage() must return a task", async () => {
    const updatedRows = await db.updateTaskStage({
      taskId: data.taskId1,
      stageId: data.stageId,
    });
    expect(updatedRows).toBe(0);
  });
});
