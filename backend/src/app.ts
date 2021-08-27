import express from "express";
import cors from "cors";
import Joi from "joi";
import path from "path";
import morgan from "morgan";

import "express-async-errors";

import { validate } from "./middlewares/validate";
import { authorize } from "./middlewares/authorize";
import { locals } from "./middlewares/locals";

import * as auth from "./controllers/auth";
import * as projects from "./controllers/projects";
import * as tasks from "./controllers/tasks";
import * as sprints from "./controllers/sprints";

const app = express();

app.use(cors());
app.use(express.json());
app.use(locals);

app.use(express.static(path.join(__dirname, "..", "public")));

const logger = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  { skip: (req, res) => process.env.NODE_ENV === "test" }
);
// @ts-ignore
app.use("/api", logger);

app.post(
  "/api/auth/login",
  validate(
    Joi.object({
      userName: Joi.string().required(),
      password: Joi.string().required(),
    })
  ),
  auth.login as any
);

app.get("/api/projects", authorize, projects.index as any);
app.get("/api/projects/:projectId", authorize, projects.show as any);
app.get("/api/projects/:projectId/tasks", authorize, tasks.index as any);
app.post(
  "/api/projects",
  authorize,
  validate(
    Joi.object({
      projectName: Joi.string().required(),
      managerId: Joi.number().required(),
      clientId: Joi.number().required(),
      devIds: Joi.array().default([]).unique().items(Joi.number().required()),
    })
  ),
  projects.store as any
);

app.post(
  "/api/projects/:projectId/sprint-tasks",
  authorize,
  validate(
    Joi.object({
      taskIds: Joi.array().items(Joi.number().required()).max(10).required(),
    }).required()
  ),
  sprints.store as any
);

export { app };
