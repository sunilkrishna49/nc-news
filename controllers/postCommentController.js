const { addCommentToArticle } = require("../models/postCommentModel");

const postComment = (req, res, next) => {
  const articleID = req.params.article_id;
  if (isNaN(articleID)) {
    return res.status(400).send({ msg: "Bad Request" });
  }
  const { username, body } = req.body;

  addCommentToArticle(articleID, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = { postComment };
