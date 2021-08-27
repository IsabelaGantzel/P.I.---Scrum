const app = require("./app");
const config = require("./config");

const port = config.PORT;
const server = app.listen(port, () => {
  console.log(`Application stated in http://localhost:${port}`);
});

process.on("SIGINT", () => {
  server.close();
  process.exit(0);
});
