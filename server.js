const dotenv = require("dotenv");
dotenv.config({
  path: "config.env",
});
const app = require("./app");

const port = process.env.PORT || 3000;
const hostname = process.env.HOST || "127.0.0.1";
const server = app.listen(port, hostname, () => {
  console.log(`Server Stated at ${hostname}:${port}`);
});

server.on("error", (error) => {
  console.log("🔥Server", error);
});
