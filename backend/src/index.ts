import { app } from "./app";

const port = 3000;
const server = app.listen(port, () => {
  console.log(`Application stated in http://localhost:${port}`);
});

process.on("SIGINT", () => {
  server.close();
  process.exit(0);
});
