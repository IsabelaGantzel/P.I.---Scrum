const express = require("express");
const cors = require("cors");
const Joi = require("joi");
const path = require("path");
const morgan = require("morgan");

require("express-async-errors");

const validate = require("./middlewares/validate");
const authorize = require("./middlewares/authorize");
const locals = require("./middlewares/locals");

const auth = require("./controllers/auth");
const projects = require("./controllers/projects");
const tasks = require("./controllers/tasks");
const sprints = require("./controllers/sprints");

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
  auth.login
);

app.get("/api/projects", authorize, projects.index);
app.get("/api/projects/:projectId", authorize, projects.show);
app.get("/api/projects/:projectId/tasks", authorize, tasks.index);
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
  projects.store
);

app.post(
  "/api/projects/:projectId/sprint-tasks",
  authorize,
  validate(
    Joi.object({
      taskIds: Joi.array().items(Joi.number().required()).max(10).required(),
    }).required()
  ),
  sprints.store
);
app.get("/api/tasks/:taskId/next-stage", tasks.nextStage);
app.get("/api/tasks/:taskId/prev-stage", tasks.prevStage);

module.exports = app;
