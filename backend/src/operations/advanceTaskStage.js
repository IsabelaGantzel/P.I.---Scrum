const { STAGES } = require("./constants");

function advanceTaskStage(stage) {
  const stageIndex = STAGES.findIndex((x) => x === stage);
  if (stageIndex === -1) return null;
  if (stageIndex === STAGES.length - 1) return null;
  return STAGES[stageIndex + 1];
}

module.exports = advanceTaskStage;
