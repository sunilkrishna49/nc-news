const express = require("express");
const { getApiEndPoints } = require("./controllers/apiEndPointController");
const { getTopics } = require("./controllers/topicsControllers");
const {
  getSinlgeArticle,
} = require("./controllers/articlesEndPointController");
const { getArticles } = require("./controllers/apiArticlesController");
const {
  getSingleArticleComments,
} = require("./controllers/apiArticleIDCommentsController");

const app = express();

app.get("/api", getApiEndPoints);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getSinlgeArticle);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getSingleArticleComments);

app.use((err, req, res, next) => {
  console.log(err);
  res.stats(500).send({ msg: err });
});

module.exports = app;
