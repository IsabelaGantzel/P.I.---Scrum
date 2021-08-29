const db = require("../database");
const advanceTaskStage = require("../operations/advanceTaskStage");
const goBackTaskStage = require("../operations/goBackTaskStage");
const orDefault = require("../lib/orDefault");

module.exports = {
  async index(req, res) {
    const { personId } = req.locals.token;
    const page = Number(orDefault(req.query.page, 0));
    const projectId = Number(req.params.projectId);
    const project = await db.getProjectById({ projectId, personId });

    if (!project) {
      res.status(404).json({ error: "Project not found" });
    } else if (project.person_id === personId) {
      const tasks = await db.getTasks({ projectId, page });
      res.json(tasks);
    } else {
      res.status(401).json({ error: "Unauthorized access to project" });
    }
  },
  async nextStage(req, res) {
    const taskId = Number(req.params.taskId);
    const task = await db.getTaskById({ taskId });

    if (!task) {
      res.status(404).json({ error: "Task not found" });
    } else {
      const nextStage = advanceTaskStage(task.stage);
      if (nextStage === null) {
        res.status(400).json({ error: "Invalid stage" });
      } else {
        const stage = await db.getStageByName({ stageName: nextStage });
        await db.updateTaskStage({ taskId, stageId: stage.id });
        res.json({ message: "Task stage update" });
      }
    }
  },
  async prevStage(req, res) {
    const taskId = Number(req.params.taskId);
    const task = await db.getTaskById({ taskId });

    if (!task) {
      res.status(404).json({ error: "Task not found" });
    } else {
      const nextStage = goBackTaskStage(task.stage);
      if (nextStage === null) {
        res.status(400).json({ error: "Invalid stage" });
      } else {
        const stage = await db.getStageByName({ stageName: nextStage });
        await db.updateTaskStage({ taskId, stageId: stage.id });
        res.json({ message: "Task stage update" });
      }
    }
  },
};
