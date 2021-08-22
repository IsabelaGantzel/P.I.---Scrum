// @ts-nocheck
const { afterAll, describe, expect, test } = require("@jest/globals");
const app = require("../../src/app");
const request = require("supertest");
const config = require("../../src/config");
const db = require("../../src/database");

describe("Api", () => {
  afterAll(() => {
    db.query.destroy();
  });
  describe("POST /api/auth/login", () => {
    test("Must fail if body as incorrect (1)", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .expect("Content-Type", /json/);

      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toHaveLength(2);
    });
    test("Must fail if body as incorrect (2)", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ userName: "admin" })
        .expect("Content-Type", /json/);

      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toHaveLength(1);
    });
    test("Must fail if body as invalid (3)", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ userName: "admin", password: "invalid-password" })
        .expect("Content-Type", /json/);

      expect(res.body).toHaveProperty("error");
    });
    test("Must works if body was correct", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ userName: "admin", password: config.ADMIN_PASSWORD })
        .expect("Content-Type", /json/);

      expect(res.body).toHaveProperty("message");
      expect(res.body).toHaveProperty("token");
    });
  });
});
