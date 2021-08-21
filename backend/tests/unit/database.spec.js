const { afterEach, describe, expect, test } = require("@jest/globals");
const db = require("../../src/database/memory");

describe("Memory Database", () => {
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
