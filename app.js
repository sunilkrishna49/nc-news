const cors = require("cors");
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
const { getUsers } = require("./controllers/getApiUsersController");
const {
  patchArticleVotes,
} = require("./controllers/patchApiArticleByIdController");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/api", getApiEndPoints);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getSinlgeArticle);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getSingleArticleComments);
app.post("/api/articles/:article_id/comments", postComment);
app.delete("/api/comments/:comment_id", deleteCommentByIdController);
app.get("/api/users", getUsers);
app.patch("/api/articles/:article_id", patchArticleVotes);

app.use((err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send({ msg: err.msg });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Violation of foreign key" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
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
