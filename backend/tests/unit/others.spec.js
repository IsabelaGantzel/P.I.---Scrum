const { requireEnvNotNull } = require("../../build/config/requireEnvNotNull");
const config = require("../../src/database/knex/config");

const { describe, expect, test } = require("@jest/globals");

describe("Others", () => {
  test("requireEnvNotNull() must throw a error if not exists a env variable", () => {
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
