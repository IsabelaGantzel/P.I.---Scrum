const db = require("../src/database");
const passwordManager = require("../src/services/passwordManager");

async function run() {
  async function makePerson({ user, password }) {
    return {
      user,
      password: await passwordManager.hashPassword(password),
    };
  }
  async function makeOrGetPersons(persons) {
    if (await db.getPersonByName(personsData[0].user)) {
      const allPersons = await Promise.all(
        persons.map((p) => db.getPersonByName(p.user))
      );
      return allPersons.map((p) => p.id);
    } else {
      return Promise.all(persons.map(makePerson));
    }
  }

  async function makeProject({ name, devs, manager, client }) {
    const [project] = await db
      .query("projects")
      .where("name", name)
      .limit(1)
      .select();
    if (project) return project.id;

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
  }

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
  console.log("Make or get persons");
  const personIds = await makeOrGetPersons(personsData);

  console.log("Make project 0");
  await makeProject({
    name: "project 0",
    client: getUser("user1"),
    manager: getUser("user2"),
    devs: getUsers(["user3", "user4"]),
  });

  console.log("Make project 1");
  await makeProject({
    name: "project 1",
    client: getUser("user5"),
    manager: getUser("user2"),
    devs: getUsers(["user3"]),
  });

  console.log("Make project 2");
  await makeProject({
    name: "project 2",
    client: getUser("user1"),
    manager: getUser("user3"),
    devs: getUsers(["user4"]),
  });
}

run().finally(() => {
  process.exit(0);
});
