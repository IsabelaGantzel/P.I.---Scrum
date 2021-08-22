const db = require("../database");

module.exports = {
  async store(req, res) {
    const clientId = await db.getClient(Number(req.body.clientId));
    const managerId = await db.getManager(Number(req.body.managerId));
    const projectData = {
      name: req.body.projectName,
      start_date: new Date(),
      final_date: null,
      manager_id: managerId,
      client_id: clientId,
    };

    const [projectId] = await db.insertProject(projectData);

    const devs = await db.insertDevs(
      req.body.devIds.map((personId) => {
        return {
          project_id: projectId,
          person_id: personId,
        };
      })
    );

    res.json({
      id: projectId,
      ...projectData,
      devs,
    });
  },
  async index(req, res) {
    const { personId } = req.locals.token;
    const { page = 0 } = req.params;
    const projects = await db.getProjects({ personId, page });
    res.json({ result: projects });
  },
  async show(req, res) {
    const { personId } = req.locals.token;
    const { projectId } = req.params;
    const project = await db.getProject({ projectId });
    res.jsoN(project);
  },
};
