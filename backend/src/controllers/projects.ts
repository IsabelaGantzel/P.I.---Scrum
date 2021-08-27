import { db } from "../database";
import { AppRequest, AppResponse } from "./types";

export async function store(req: AppRequest, res: AppResponse) {
  const { devIds } = req.body;
  const clientId = await db.getClient(Number(req.body.clientId));
  const managerId = await db.getManager(Number(req.body.managerId));
  const projectData = {
    name: req.body.projectName,
    start_date: new Date(),
    final_date: null,
    manager_id: managerId,
    client_id: clientId,
  };

  const projectId = await db.insertProject(projectData);

  const devs = await db.insertDevs({ projectId, devIds });

  res.json({
    id: projectId,
    ...projectData,
    devs,
  });
}

export async function index(req: AppRequest, res: AppResponse) {
  const { personId } = req.locals.token;
  const page = req.query.page ? Number(req.query.page) : 0;
  const projects = await db.getProjects({ personId, page });
  res.json({ result: projects });
}

export async function show(req: AppRequest, res: AppResponse) {
  const { personId } = req.locals.token;
  const projectId = Number(req.params.projectId);
  const project = await db.getProject({ projectId, personId });
  if (!project) {
    res.status(404).json({ error: "Project not found" });
  } else if (project.person_id === personId) {
    res.json(project);
  } else {
    res.status(401).json({ error: "Unauthorized access to project" });
  }
}
