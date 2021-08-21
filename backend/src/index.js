const express = require("express");
const cors = require("cors");
const Joi = require("joi");
const path = require("path");
require("express-async-errors");

const validateRequest = require("./validateRequest");
const jwtManager = require("./services/jwtManager");

const auth = require("./controllers/auth");
const projects = require("./controllers/projects");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "public")));

function extractToken(req) {
  const BEARER = "Bearer ";
  const bearerToken = req.headers["Authorization"];
  if (bearerToken && bearerToken.startsWith(BEARER)) {
    return jwtManager.readToken(bearerToken.slice(BEARER.length));
  }
  return null;
}

app.post(
  "/api/auth/login",
  validateRequest(
    Joi.object({
      userName: Joi.string().required(),
      password: Joi.string().required(),
    })
  ),
  auth.login
);

app.get("/api/projects", async (req, res) => {
  const token = await extractToken(req);
  console.log(token);
  res.json({ HERE: "2" });
});

app.get("/api/projects/:projectId", (req, res) => {
  res.json({ message: "OK" });
});

app.post(
  "/api/projects",
  validateRequest(
    Joi.object({
      projectName: Joi.string().required(),
      managerId: Joi.number().required(),
      clientId: Joi.number().required(),
      devIds: Joi.array().default([]).unique().items(Joi.number().required()),
    })
  ),
  projects.store
);

const port = 3000;
const server = app.listen(port, () => {
  console.log(`Application stated in http://localhost:${port}`);
});

process.on("SIGINT", () => {
  server.close();
  process.exit(0);
});
