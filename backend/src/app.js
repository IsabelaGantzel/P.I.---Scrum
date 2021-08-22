const express = require("express");
const cors = require("cors");
const Joi = require("joi");
const path = require("path");
require("express-async-errors");

const validate = require("./middlewares/validate");
const authorize = require("./middlewares/authorize");

const auth = require("./controllers/auth");
const projects = require("./controllers/projects");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "public")));

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

app.get("/api/projects", authorize, async (req, res) => {
  res.json({ message: "OK" });
});

app.get("/api/projects/:projectId", authorize, async (req, res) => {
  res.json({ message: "OK" });
});

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
