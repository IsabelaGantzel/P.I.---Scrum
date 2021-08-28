const db = require("../database");
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
};
