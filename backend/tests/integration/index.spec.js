// @ts-nocheck
const { afterAll, describe, expect, test } = require("@jest/globals");
const app = require("../../src/app");
const request = require("supertest");
const db = require("../../src/database");
const passwordManager = require("../../src/services/passwordManager");
const jwtManager = require("../../src/services/jwtManager");

function expectError(res, statusCode, message) {
  expect(res.statusCode).toBe(statusCode);
  expect(res.body).toHaveProperty("error", message);
}

describe("Api", () => {
  afterAll(() => {
    db.query.destroy();
  });

  describe("POST /api/auth/login", () => {
    test("Must fail if body as incorrect (missing body)", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .expect("content-type", /json/);

      expect(res.body).toHaveProperty("error");
      expect(res.body).toHaveProperty("errors");
      expect(res.body.errors).toHaveLength(2);
    });
    test("Must fail if body as incorrect (missing password)", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ userName: "admin" })
        .expect("content-type", /json/);

      expect(res.body).toHaveProperty("error");
      expect(res.body).toHaveProperty("errors");
      expect(res.body.errors).toHaveLength(1);
    });
    test("Must fail if body as invalid (invalid userName)", async () => {
      jest.spyOn(db, "getPersonByName").mockResolvedValue(null);
      const res = await request(app)
        .post("/api/auth/login")
        .send({ userName: "anyone", password: "invalid-password" })
        .expect("content-type", /json/);

      expect(res.body).toHaveProperty("error");
    });
    test("Must fail if body as invalid (invalid password)", async () => {
      jest.spyOn(passwordManager, "checkPassword").mockResolvedValue(false);
      jest
        .spyOn(db, "getPersonByName")
        .mockResolvedValue({ id: 0, password: "other-password" });
      const res = await request(app)
        .post("/api/auth/login")
        .send({ userName: "admin", password: "invalid-password" })
        .expect("content-type", /json/);

      expect(res.body).toHaveProperty("error");
    });
    test("Must works if body was correct", async () => {
      jest.spyOn(passwordManager, "checkPassword").mockResolvedValue(true);
      jest.spyOn(db, "getPersonByName").mockResolvedValue({ id: 0 });
      jest
        .spyOn(jwtManager, "generateToken")
        .mockResolvedValue({ personId: 0 });
      const res = await request(app)
        .post("/api/auth/login")
        .send({ userName: "admin", password: "valid-password" })
        .expect("content-type", /json/);

      expect(res.body).toHaveProperty("message");
      expect(res.body).toHaveProperty("token");
    });
  });

  describe("Authorized routes", () => {
    class NamedError extends Error {
      constructor(name) {
        super();
        this.name = name;
      }
    }
    test("Must fail if not authenticated", async () => {
      const res = await request(app)
        .get("/api/projects")
        .expect("content-type", /json/);

      expectError(res, 401, "Missing authorization token");
    });
    test("Must fail if token was expired", async () => {
      jest
        .spyOn(jwtManager, "readToken")
        .mockRejectedValueOnce(new NamedError("TokenExpiredError"));

      const res = await request(app)
        .get("/api/projects")
        .set("authorization", "Bearer fake-token")
        .expect("content-type", /json/);

      expectError(res, 401, "Expired authorization token");
    });
    test("Must fail if token was expired", async () => {
      jest
        .spyOn(jwtManager, "readToken")
        .mockRejectedValueOnce(new NamedError("JsonWebTokenError"));

      const res = await request(app)
        .get("/api/projects")
        .set("authorization", "Bearer fake-token")
        .expect("content-type", /json/);

      expectError(res, 401, "Invalid authorization token");
    });
    test("Must fail if something bad happens", async () => {
      jest.spyOn(jwtManager, "readToken").mockRejectedValueOnce(new Error());

      await request(app)
        .get("/api/projects")
        .set("authorization", "Bearer fake-token")
        .expect("content-type", /html/);
    });
  });

  describe("GET /api/projects", () => {
    test("Must return a list of projects", async () => {
      jest.spyOn(jwtManager, "readToken").mockReturnValueOnce({ personId: 1 });
      jest
        .spyOn(db, "getProjects")
        .mockResolvedValueOnce([{ id: 0, name: "mock" }]);
      const res = await request(app)
        .get("/api/projects")
        .set("authorization", "Bearer fake-token")
        .expect("content-type", /json/);

      expect(res.body).toHaveProperty("result");
      expect(res.body.result).toHaveLength(1);
    });
  });
  describe("GET /api/projects/{projectId}", () => {
    const personId = 1;
    beforeAll(() => {
      jest.spyOn(jwtManager, "readToken").mockReturnValue({ personId });
    });
    afterAll(() => {
      jest.restoreAllMocks();
    });

    test("Must return a project", async () => {
      jest
        .spyOn(db, "getProject")
        .mockResolvedValueOnce({ id: 0, person_id: personId });

      const res = await request(app)
        .get("/api/projects/1")
        .set("authorization", "Bearer fake-token")
        .expect("content-type", /json/);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("id", 0);
    });
    test("Must return a error if not found", async () => {
      jest.spyOn(db, "getProject").mockResolvedValueOnce(null);

      const res = await request(app)
        .get("/api/projects/1")
        .set("authorization", "Bearer fake-token")
        .expect("content-type", /json/);

      expectError(res, 404, "Project not found");
    });
    test("Must return a error if user is not the owner", async () => {
      jest
        .spyOn(db, "getProject")
        .mockResolvedValueOnce({ id: 0, person_id: -1 });

      const res = await request(app)
        .get("/api/projects/1")
        .set("authorization", "Bearer fake-token")
        .expect("content-type", /json/);

      expectError(res, 401, "Unauthorized access to project");
    });
  });
  describe("GET /api/projects/{projectId}/tasks", () => {
    const personId = 1;
    beforeAll(() => {
      jest.spyOn(jwtManager, "readToken").mockResolvedValue({ personId });
    });
    afterAll(() => {
      jest.restoreAllMocks();
    });

    test("Must return a project", async () => {
      jest
        .spyOn(db, "getProjectById")
        .mockResolvedValueOnce({ id: 0, person_id: personId });
      jest.spyOn(db, "getTasks").mockResolvedValueOnce([{ id: 0 }]);

      const res = await request(app)
        .get("/api/projects/1/tasks")
        .set("authorization", "Bearer fake-token")
        .expect("content-type", /json/);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(1);
    });
    test("Must return a error if not found", async () => {
      jest.spyOn(db, "getProjectById").mockResolvedValueOnce(null);

      const res = await request(app)
        .get("/api/projects/1/tasks")
        .set("authorization", "Bearer fake-token")
        .expect("content-type", /json/);

      expectError(res, 404, "Project not found");
    });
    test("Must return a error if user is not the owner", async () => {
      jest
        .spyOn(db, "getProjectById")
        .mockResolvedValueOnce({ id: 0, person_id: -1 });

      const res = await request(app)
        .get("/api/projects/1/tasks")
        .set("authorization", "Bearer fake-token")
        .expect("content-type", /json/);

      expectError(res, 401, "Unauthorized access to project");
    });
  });
  describe("POST /api/projects", () => {
    test("Must return the project infos", async () => {
      jest.spyOn(jwtManager, "readToken").mockReturnValueOnce({ personId: 1 });
      jest.spyOn(db, "getClient").mockResolvedValueOnce(0);
      jest.spyOn(db, "getManager").mockResolvedValueOnce(0);
      jest.spyOn(db, "insertDevs").mockResolvedValueOnce([0]);
      jest.spyOn(db, "insertProject").mockResolvedValueOnce(0);
      const res = await request(app)
        .post("/api/projects")
        .send({
          projectName: "project test",
          managerId: 0,
          clientId: 0,
          devIds: [0],
        })
        .set("authorization", "Bearer fake-token")
        .expect("content-type", /json/);

      expect(res.body).toHaveProperty("id", 0);
      expect(res.body).toHaveProperty("name", "project test");
      expect(res.body).toHaveProperty("start_date");
      expect(res.body).toHaveProperty("final_date");
      expect(res.body).toHaveProperty("manager_id", 0);
      expect(res.body).toHaveProperty("client_id", 0);
      expect(res.body).toHaveProperty("devs", [0]);
    });
  });
  describe("POST /api/projects/{projectId}/sprint-tasks", () => {
    const personId = 1;
    beforeAll(() => {
      jest.spyOn(jwtManager, "readToken").mockResolvedValue({ personId });
      jest
        .spyOn(db, "getProjectById")
        .mockResolvedValue({ id: 0, person_id: personId });
      jest.spyOn(db, "getFreeTasks").mockResolvedValue([{}]);
      jest.spyOn(db, "getCurrentSprint").mockResolvedValue(null);
      jest.spyOn(db, "insertSprint").mockResolvedValue(0);
      jest.spyOn(db, "insertTasksToSprint").mockResolvedValue(null);
    });

    function doRequest() {
      return request(app)
        .post("/api/projects/1/sprint-tasks")
        .send({ taskIds: [0] })
        .set("authorization", "Bearer fake-token")
        .expect("content-type", /json/);
    }

    test("Must return success if pass for all validations (1)", async () => {
      const res = await doRequest();
      expect(res.statusCode).toBe(200);

      expect(res.body).toHaveProperty(
        "message",
        "Tasks was linked with sprints successfully"
      );
    });
    test("Must return success if pass for all validations (2)", async () => {
      jest.spyOn(db, "getCurrentSprint").mockResolvedValueOnce({ id: 0 });

      const res = await doRequest();
      expect(res.statusCode).toBe(200);

      expect(res.body).toHaveProperty(
        "message",
        "Tasks was linked with sprints successfully"
      );
    });
    test("Must return a error if user is not the owner", async () => {
      jest.spyOn(db, "getFreeTasks").mockResolvedValueOnce([{ sprint_id: 1 }]);

      const res = await doRequest();
      expectError(res, 400, "Invalid tasks");
    });
    test("Must return a error if not found", async () => {
      jest.spyOn(db, "getProjectById").mockResolvedValueOnce(null);

      const res = await doRequest();
      expectError(res, 404, "Project not found");
    });
    test("Must return a error if user is not the owner", async () => {
      jest
        .spyOn(db, "getProjectById")
        .mockResolvedValueOnce({ id: 0, person_id: -1 });

      const res = await doRequest();
      expectError(res, 401, "Unauthorized access to project");
    });
  });
});
