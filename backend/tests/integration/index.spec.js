// @ts-nocheck
const { afterAll, describe, expect, test } = require("@jest/globals");
const app = require("../../src/app");
const request = require("supertest");
const db = require("../../src/database");
const passwordManager = require("../../src/services/passwordManager");
const jwtManager = require("../../src/services/jwtManager");

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
      expect(res.body.error).toHaveLength(2);
    });
    test("Must fail if body as incorrect (missing password)", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ userName: "admin" })
        .expect("content-type", /json/);

      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toHaveLength(1);
    });
    test("Must fail if body as invalid (invalid userName)", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ userName: "anyone", password: "invalid-password" })
        .expect("content-type", /json/);

      expect(res.body).toHaveProperty("error");
    });
    test("Must fail if body as invalid (invalid password)", async () => {
      jest.spyOn(passwordManager, "checkPassword").mockResolvedValue(false);
      const res = await request(app)
        .post("/api/auth/login")
        .send({ userName: "admin", password: "invalid-password" })
        .expect("content-type", /json/);

      expect(res.body).toHaveProperty("error");
    });
    test("Must works if body was correct", async () => {
      jest.spyOn(passwordManager, "checkPassword").mockResolvedValue(true);
      const res = await request(app)
        .post("/api/auth/login")
        .send({ userName: "admin", password: "valid-password" })
        .expect("content-type", /json/);

      expect(res.body).toHaveProperty("message");
      expect(res.body).toHaveProperty("token");
    });
  });

  function authRequired(route, method = "get") {
    test(`${method.toUpperCase()} ${route} must fail if not authenticated`, async () => {
      const res = await request(app)
        [method](route)
        .expect("content-type", /json/);

      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toBe("Missing authorization token");
    });
  }

  describe("Routes must be authenticated", () => {
    authRequired("/api/projects", "post");
    authRequired("/api/projects");
    authRequired("/api/projects/1");
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
  describe("POST /api/projects", () => {
    test("Must return the project infos", async () => {
      jest.spyOn(jwtManager, "readToken").mockReturnValueOnce({ personId: 1 });
      jest.spyOn(db, "getClient").mockResolvedValueOnce(0);
      jest.spyOn(db, "getManager").mockResolvedValueOnce(0);
      jest.spyOn(db, "insertDevs").mockResolvedValueOnce([0]);
      jest.spyOn(db, "insertProject").mockResolvedValueOnce([0]);
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
});
