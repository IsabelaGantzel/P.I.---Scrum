const db = require("../database");
const isNil = require("../lib/isNil");

module.exports = {
  async store(req, res) {
    const projectId = Number(req.params.projectId);
    const { personId } = req.locals.token;
    const { taskIds } = req.body;

    const project = await db.getProjectById({ projectId, personId });

    if (!project) {
      res.status(404).json({ error: "Project not found" });
    } else if (project.person_id === personId) {
      const tasks = await db.getFreeTasks({ projectId, taskIds });

      if (
        tasks.length !== taskIds.length ||
        tasks.some((x) => !isNil(x.sprint_id))
      ) {
        res.status(400).json({ error: "Invalid tasks" });
      } else {
        const currentSprint = await db.getCurrentSprint({ projectId });
        const sprintId = currentSprint
          ? currentSprint.id
          : await db.insertSprint();
        await db.insertTasksToSprint({ taskIds, sprintId: sprintId });
        res.json({ message: "Tasks was linked with sprints successfully" });
      }
    } else {
      res.status(401).json({ error: "Unauthorized access to project" });
    }
  },
};
