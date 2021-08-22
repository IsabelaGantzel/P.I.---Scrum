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
  });

  const DAYS = 3600;
  let id = 10;
  let data = {
    clientPersonId: 0,
    managerPersonId: 0,
    projectId: 0,
    managerId: 0,
    clientId: 0,
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
    const [projectId] = await db.query("projects").insert({
      name: "project-0",
      start_date: Date.now(),
      final_date: Date.now() + 30 + DAYS,
      manager_id: managerId,
      client_id: clientId,
    });

    data = {
      clientPersonId,
      managerPersonId,
      projectId,
      managerId,
      clientId,
    };
  });

  test(`db.insertDevs() must returns an array of ids`, async () => {
    const currentId = id++;
    const result = await db.insertDevs([
      {
        id: currentId,
        person_id: data.managerPersonId,
        project_id: data.projectId,
      },
    ]);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(currentId);
  });
  test(`db.insertProject() must returns an array of ids`, async () => {
    const currentId = id++;
    const result = await db.insertProject({
      id: currentId,
      name: "fake",
      start_date: Date.now(),
      final_date: Date.now() + 30 * DAYS,
      client_id: data.clientId,
      manager_id: data.managerId,
    });
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(currentId);
  });

  describe("Invariant selection", () => {
    test(`db.getClient() must returns null`, async () => {
      const id = await db.getClient(-1);
      expect(id).toBeNull();
    });
    test(`db.getManager() must returns null`, async () => {
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
    const project = await db.getProject({ projectId: data.projectId });
    expect(project).not.toBeNull();
    expect(project).toHaveProperty("id", data.projectId);
    expect(project).toHaveProperty("name");
    expect(project).toHaveProperty("start_date");
    expect(project).toHaveProperty("final_date");
    expect(project).toHaveProperty("manager_id");
    expect(project).toHaveProperty("client_id");
    expect(project).toHaveProperty("sprint_count", 0);
    expect(project).toHaveProperty("tasks");
    expect(project.tasks).toHaveLength(0);
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
    });
  });
});
