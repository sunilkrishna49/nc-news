const express = require("express");
const { getApiEndPoints } = require("./controllers/apiEndPointController");

const app = express();

app.get("/api", getApiEndPoints);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send();
});

module.exports = app;
