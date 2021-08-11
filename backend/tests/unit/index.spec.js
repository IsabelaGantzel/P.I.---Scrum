// @ts-nocheck

const { STAGES } = require("../../src/operations/constants");
const goBackTaskStage = require("../../src/operations/goBackTaskStage");
const advanceTaskStage = require("../../src/operations/advanceTaskStage");
const storeProject = require("../../src/operations/storeProject");
const passwordManager = require("../../src/operations/passwordManager");

describe("Update task stage", () => {
  test("advanceTaskStage must returns 'null' if stage is not defined", () => {
    expect(advanceTaskStage("")).toBeNull();
  });
  test("advanceTaskStage must returns 'null' if stage is the last stage", () => {
    expect(advanceTaskStage(STAGES[STAGES.length - 1])).toBeNull();
  });
  test("advanceTaskStage must returns a string if stage is not the last stage", () => {
    for (let i = 0; i < STAGES.length - 1; i++) {
      expect(typeof advanceTaskStage(STAGES[i])).toBe("string");
    }
  });

  test("goBackTaskStage must returns 'null' if stage is not defined", () => {
    expect(goBackTaskStage("")).toBeNull();
  });
  test("goBackTaskStage must returns 'null' if stage is the first stage", () => {
    expect(goBackTaskStage(STAGES[0])).toBeNull();
  });
  test("goBackTaskStage must returns a string if stage is not the first stage", () => {
    for (let i = 1; i < STAGES.length; i++) {
      expect(typeof goBackTaskStage(STAGES[i])).toBe("string");
    }
  });
});

describe("Store project", () => {
  test("Must store a project if all fields are passed", async () => {
    const data = {
      projectName: "Test",
      clientPersonId: 0,
      managerPersonId: 1,
      startDate: new Date(),
      devIds: [2],
      getClientByPersonId(x) {
        return x;
      },
      getManagerByPersonId(x) {
        return x;
      },
      storeDevsInDatabase(devs) {},
      storeProjectInDatabase(project) {
        return 1;
      },
    };
    const result = await storeProject(data);

    expect(result).toMatchObject({
      id: 1,
      start_date: data.startDate,
      final_date: null,
      name: data.projectName,
      client_id: data.clientPersonId,
      manager_id: data.managerPersonId,
      devs: [{ project_id: 1, person_id: 2 }],
    });
  });
});

describe("Password manager", () => {
  const input = "Hello world";
  let hash;
  test("hashPassword must encrypt a input string", async () => {
    hash = await passwordManager.hashPassword(input);
    expect(typeof hash).toBe("string");
    expect(hash).not.toBe(input);
  });
  test("checkPassword must returns 'true' a valid hash of a string", async () => {
    const result = passwordManager.checkPassword(input, hash);
    expect(result).toBe(true);
  });
  test("checkPassword must returns 'false' if a hash is not of a string", async () => {
    const result = passwordManager.checkPassword(input, input);
    expect(result).toBe(false);
  });
});
