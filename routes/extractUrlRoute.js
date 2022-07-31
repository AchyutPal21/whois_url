const express = require("express");
const router = express.Router();
const {
  urlExtractor,
  renderPage,
} = require("../controller/extractUrlController");

router.route("/").get(renderPage).post(urlExtractor);

module.exports = { router };
