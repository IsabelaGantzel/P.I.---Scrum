const express = require("express");
const cors = require("cors");
const Joi = require("joi");
const path = require("path");
require("express-async-errors");

const validateRequest = require("./validateRequest");
const db = require("./memory-database");
const jwtManager = require("./services/jwtManager");

async function getClientId(personId) {
  for (const id in db.clients.entities) {
    if (db.clients.entities[id].person_id === personId) {
      return id;
    }
  }
  const [clientId] = await db.clients.insert({ person_id: personId });
  return clientId;
}

async function getManagerId(personId) {
  for (const id in db.managers.entities) {
    if (db.managers.entities[id].person_id === personId) {
      return id;
    }
  }
  const [clientId] = await db.managers.insert({ person_id: personId });
  return clientId;
}

async function getPersonByName(userName) {
  for (const id in db.persons.entities) {
    const person = db.persons.entities[id];
    if (person.name === userName) {
      return person;
    }
  }
  return null;
}

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "public")));

const mockPersonId = 1231231;

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
  async (req, res) => {
    try {
      // const person = await getPersonByName(req.body.userName);
      const token = jwtManager.generateToken({ personId: mockPersonId });
      res.json({
        token,
        message: "Login success!",
      });
    } catch (err) {
      console.log(err);
    }
  }
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
  async (req, res) => {
    const clientId = await getClientId(Number(req.body.clientId));
    const managerId = await getManagerId(Number(req.body.managerId));
    const projectData = {
      name: req.body.projectName,
      start_date: new Date(),
      final_date: null,
      manager_id: managerId,
      client_id: clientId,
    };

    const [projectId] = await db.projects.insert(projectData);

    await db.devs.insert(
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
    });
  }
);

app.get("/debug", (req, res) => {
  console.log(
    Object.fromEntries(
      Object.entries(db).map(([key, value]) => {
        return [key, { entities: value.entities, currentId: value.currentId }];
      })
    )
  );
  res.json({ ok: true });
});

const port = 3000;
const server = app.listen(port, () => {
  console.log(`Application stated in http://localhost:${port}`);
});

process.on("SIGINT", () => {
  server.close();
  process.exit(0);
});
