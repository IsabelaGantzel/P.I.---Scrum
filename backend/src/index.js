const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/project/:projectId", (req, res) => {
  console.log(req.params);
  res.json({ message: "OK" });
});

app.post("/api/project", (req, res) => {
  console.log(req.body);
  res.json({ message: "OK" });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Application stated in http://localhost:${port}`);
});
