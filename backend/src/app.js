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

const app = express();

app.use(cors());
app.use(express.json());
app.use(locals);

app.use(express.static(path.join(__dirname, "..", "public")));

// @ts-ignore
app.use(
  "/api",
  morgan(":method :url :status :res[content-length] - :response-time ms", {
    skip: (req, res) => process.env.NODE_ENV === "test",
  })
);

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

module.exports = app;
