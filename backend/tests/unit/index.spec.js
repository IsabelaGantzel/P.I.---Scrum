// @ts-nocheck

const { STAGES } = require("../../src/operations/constants");
const goBackTaskStage = require("../../src/operations/goBackTaskStage");
const advanceTaskStage = require("../../src/operations/advanceTaskStage");

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