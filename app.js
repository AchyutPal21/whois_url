const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { router } = require("./routes/extractUrlRoute");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

const corsOptions = {
  origin: process.env.ALLOWED_CORS_CLIENTS.split(","),
};
app.use(cors(corsOptions));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use("/", router);

module.exports = app;
