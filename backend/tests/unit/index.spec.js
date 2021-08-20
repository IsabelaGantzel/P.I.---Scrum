const { describe, expect, test } = require("@jest/globals");
const JestDateMock = require("jest-date-mock");

const { STAGES } = require("../../src/operations/constants");
const goBackTaskStage = require("../../src/operations/goBackTaskStage");
const advanceTaskStage = require("../../src/operations/advanceTaskStage");
const storeProject = require("../../src/operations/storeProject");
const validateStoreProject = require("../../src/operations/validateStoreProject");
const passwordManager = require("../../src/services/passwordManager");
const jwtManager = require("../../src/services/jwtManager");

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
  const projectData = {
    projectName: "Test",
    clientPersonId: 0,
    managerPersonId: 1,
    startDate: Date.now(),
    devIds: [2],
  };

  test("Must store a project if all fields are passed", async () => {
    const data = {
      ...projectData,
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

  describe("Validate project data", () => {
    async function doTest(attrs) {
      return validateStoreProject({
        ...projectData,
        existsPersonById() {
          return true;
        },
        ...attrs,
      });
    }

    test("must returns { value } if the data is valid and ids exists", async () => {
      const result = await doTest({});
      expect(result.value).toMatchObject(projectData);
    });
    test("must returns { name, error, message } if has type errors", async () => {
      const result = await doTest({
        projectName: 123,
        clientPersonId: "x",
        managerPersonId: "y",
      });
      expect(result.name).toBeDefined();
      expect(result.error).toBeDefined();
    });

    function testPersonIdExists(label, invalidId) {
      test(`must returns { name, message } if some person id not exists (${label})`, async () => {
        const result = await doTest({
          existsPersonById: (personId) => personId !== invalidId,
        });
        expect(result.name).toBeDefined();
        expect(result.error).toBeUndefined();
      });
    }

    testPersonIdExists("manager", projectData.managerPersonId);
    testPersonIdExists("client", projectData.clientPersonId);
    testPersonIdExists("dev", projectData.devIds[0]);
  });
});

describe("JWT manager", () => {
  const input = { id: 1 };
  let token;

  test("generateToken must create a token of a object", async () => {
    token = await jwtManager.generateToken(input);
    expect(typeof token).toBe("string");
    expect(token).not.toBe(input);
  });
  test("readToken must returns a object of a token", async () => {
    const result = await jwtManager.readToken(token);
    expect(result).toMatchObject(input);
  });
  test("readToken must fail with a expired token", async () => {
    // Update internal time to test expired feature
    const today = Date.now();
    const ONE_DAY = 24 * 60 * 60 * 1000;
    const sevenDays = 7 * ONE_DAY; // Expiration gap
    const advancedTime = today + sevenDays + ONE_DAY;
    JestDateMock.advanceTo(advancedTime);

    try {
      await jwtManager.readToken(token);
    } catch (err) {
      expect(typeof err).toBe("object");
      expect(typeof err.name).toBe("string");
      expect(err.name).toBe("TokenExpiredError");
    }

    JestDateMock.clear();
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
    const result = await passwordManager.checkPassword(input, hash);
    expect(result).toBe(true);
  });
  test("checkPassword must returns 'false' if a hash is not of a string", async () => {
    const result = await passwordManager.checkPassword(input, input);
    expect(result).toBe(false);
  });
});
