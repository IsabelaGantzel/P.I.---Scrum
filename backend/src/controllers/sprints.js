const db = require("../database");

module.exports = {
  async store(req, res) {
    const { personId } = req.locals.token;
    const { projectId } = req.params;
    const { taskIds } = req.body;

    const project = await db.getProjectById({ projectId, personId });

    if (!project) {
      res.status(404).json({ error: "Project not found" });
    } else if (project.person_id === personId) {
      const tasks = await db.getFreeTasks({ projectId, taskIds });

      if (tasks.length !== taskIds.length || tasks.some((x) => x.sprint_id)) {
        res.status(401).json({ error: "Invalid tasks" });
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
