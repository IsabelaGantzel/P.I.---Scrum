const db = require("../src/database");
const passwordManager = require("../src/services/passwordManager");

async function makePerson({ user, password }) {
  return {
    user,
    password: await passwordManager.hashPassword(password),
  };
}
async function makeOrGetPersons(persons) {
  const existPerson = Boolean(await db.getPersonByName(persons[0].user));
  console.log("Make or get persons", { existPerson });
  if (existPerson) {
    const allPersons = await Promise.all(
      persons.map((p) => db.getPersonByName(p.user))
    );
    return allPersons.map((p) => p.id);
  } else {
    const allPersons = await Promise.all(persons.map(makePerson));
    const personIds = await Promise.all(allPersons.map(db.insertPerson));
    return personIds.flat();
  }
}

async function makeProject({ name, devs, manager, client }) {
  const [project] = await db
    .query("projects")
    .where("name", name)
    .limit(1)
    .select();
  if (project) return project.id;
  console.log("Make project", { name, devs, manager, client });

  const managerId = await db.getManager(manager);
  const clientId = await db.getClient(client);
  const [projectId] = await db.insertProject({
    name,
    start_date: Date.now(),
    final_date: null,
    manager_id: managerId,
    client_id: clientId,
  });
  await db.insertDevs(
    devs.map((id) => ({
      project_id: projectId,
      person_id: id,
    }))
  );
  return projectId;
}

async function getProject({ name }) {
  const [project] = await db.query
    .select()
    .from("projects")
    .where("name", name);
  return Boolean(project);
}

async function addTasksToProject({ projectId, tasks }) {
  console.log("Add tasks to project", { projectId, tasks });
  const tasksIds = await Promise.all(
    tasks.map((t) => db.query("tasks").insert({ ...t, project_id: projectId }))
  );
  return tasksIds.flat();
}

const DAYS = 3600;
async function createSprint() {
  const [sprintId] = await db.query("sprints").insert({
    start_date: new Date(Date.now()),
    final_date: new Date(Date.now() + 7 * DAYS),
  });
  return sprintId;
}

async function getOrCreateSprint({ projectId }) {
  const [sprintId] = await db.query
    .select("sp.id")
    .from({ st: "sprint_tasks", p: "projects", t: "tasks", sp: "sprints" })
    .whereRaw(db.query.raw("p.id = t.project_id"))
    .andWhereRaw(db.query.raw("st.task_id = t.id"))
    .andWhereRaw(db.query.raw("st.sprint_id = sp.id"))
    .andWhere("sp.is_open", true)
    .andWhere("p.id", projectId)
    .limit(1);
  if (sprintId) return sprintId;
  return await createSprint();
}

async function addTasksToSprint({ sprintId, tasks }) {
  console.log("Add tasks to sprint", { sprintId, tasks });
  const [stage] = await db.query
    .select()
    .from("stages")
    .where("name", "=", "Started")
    .limit(1);

  const sprintTasks = tasks.map((taskId) => ({
    task_id: taskId,
    sprint_id: sprintId,
    stage_id: stage.id,
  }));

  return await db.query("sprint_tasks").insert(sprintTasks);
}

async function run() {
  function getUser(userName) {
    const index = personsData.findIndex((p) => p.user === userName);
    return personIds[index];
  }
  function getUsers(userNames) {
    return userNames.map(getUser);
  }

  const personsData = [
    { user: "user1", password: "123mudar" }, // client
    { user: "user2", password: "123mudar" }, // manager (2)
    { user: "user3", password: "123mudar" }, // manager, dev (2)
    { user: "user4", password: "123mudar" }, // dev (2)
    { user: "user5", password: "123mudar" }, // client
  ];
  const personIds = await makeOrGetPersons(personsData);
  console.log("Make or get persons", { personIds });

  await makeProject({
    name: "project 0",
    client: getUser("user1"),
    manager: getUser("user2"),
    devs: getUsers(["user3", "user4"]),
  });

  if (!(await getProject({ name: "project 1" }))) {
    const projectId = await makeProject({
      name: "project 1",
      client: getUser("user5"),
      manager: getUser("user2"),
      devs: getUsers(["user3"]),
    });

    const taskIds = await addTasksToProject({
      projectId,
      tasks: [
        {
          title: "task 3",
          description: "The begin",
          points: 23,
        },
        {
          title: "task 4",
          description: "The begin",
          points: 10,
        },
      ],
    });

    const sprintId = await getOrCreateSprint({ projectId });

    await addTasksToSprint({ sprintId, tasks: [taskIds[1]] });
  } else {
    console.log("project 1 already exists");
  }

  if (!(await getProject({ name: "project 2" }))) {
    const projectId = await makeProject({
      name: "project 2",
      client: getUser("user1"),
      manager: getUser("user3"),
      devs: getUsers(["user4"]),
    });

    const taskIds = await addTasksToProject({
      projectId,
      tasks: [
        {
          title: "task 1",
          description: "The begin",
          points: 23,
        },
        {
          title: "task 2",
          description: "The begin",
          points: 10,
        },
      ],
    });

    const sprintId = await getOrCreateSprint({ projectId });

    await addTasksToSprint({ sprintId, tasks: [taskIds[0]] });
  } else {
    console.log("project 2 already exists");
  }
}

run()
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    process.exit(0);
  });
