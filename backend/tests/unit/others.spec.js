const requireEnvNotNull = require("../../src/config/requireEnvNotNull");
const config = require("../../src/database/knex/config");
const orDefault = require("../../src/lib/orDefault");

const { describe, expect, test } = require("@jest/globals");

describe("Others", () => {
  test("orDefault() must return the value if it was not null", async () => {
    expect(orDefault(0, 1)).toBe(0);
    expect(orDefault("", 1)).toBe("");
    expect(orDefault(false, 1)).toBe(false);
  });
  test("orDefault() must return the default value if it was null", async () => {
    expect(orDefault(null, 1)).toBe(1);
    expect(orDefault(undefined, 1)).toBe(1);
  });
  test("requireEnvNotNull() must throw a error if not exists a env variable", () => {
    process.env.NON_EXIST_KEY = "[INVALID_KEY]";
    expect(() => {
      requireEnvNotNull("NON_EXIST_KEY");
    }).toThrow(
      new Error("Environment variable 'NON_EXIST_KEY' can't be null!")
    );
  });
  test("config.pool.afterCreate() must be fine", (done) => {
    const connection = {
      run: jest.fn().mockImplementation((_, cb) => cb()),
    };
    function afterCreateDone() {
      expect(connection.run).toHaveBeenCalledWith(
        "PRAGMA foreign_keys = ON",
        afterCreateDone
      );

      done();
    }

    config.pool.afterCreate(connection, afterCreateDone);
  });
});
