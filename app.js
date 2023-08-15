const express = require("express");
const { getTopics } = require("./controllers/topicsControllers");

const app = express();

app.get("/api/topics", getTopics);

app.use((err, res, req, next) => {
  console.log(err);
  res.stats(500).send({});
});

module.exports = app;
