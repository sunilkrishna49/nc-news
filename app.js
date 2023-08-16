const express = require("express");
const { getApiEndPoints } = require("./controllers/apiEndPointController");
const { getTopics } = require("./controllers/topicsControllers");
const {
  getSinlgeArticle,
} = require("./controllers/articlesEndPointController");

const app = express();

app.get("/api", getApiEndPoints);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getSinlgeArticle);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "internalServer Error" });
});
module.exports = app;
