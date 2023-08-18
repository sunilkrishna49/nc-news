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
const { postComment } = require("./controllers/postCommentController");
const {
  deleteCommentByIdController,
} = require("./controllers/deleteCommentsByIdController");

const app = express();

app.use(express.json());

app.get("/api", getApiEndPoints);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getSinlgeArticle);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getSingleArticleComments);
app.post("/api/articles/:article_id/comments", postComment);
app.delete("/api/comments/:comment_id", deleteCommentByIdController);

app.use((err, req, res, next) => {
  if (err.status === 404 || err.code === "23503") {
    res.status(404).send({ msg: "Article not found" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: err });
});

module.exports = app;
