const { STAGES } = require("./constants");

function goBackTaskStage(stage) {
  const stageIndex = STAGES.findIndex((x) => x === stage);
  if (stageIndex === -1) return null;
  if (stageIndex === 0) return null;
  return STAGES[stageIndex - 1];
}

module.exports = goBackTaskStage;
