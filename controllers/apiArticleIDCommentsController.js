const { getCommentsById } = require("../models/apiArticleIDCommentsModel");

const getSingleArticleComments = (req, res, next) => {
  const articleId = req.params.article_id;

  if (isNaN(articleId)) {
    return res.status(400).send({ msg: "Bad Request" });
  }

  getCommentsById(articleId)
    .then((comments) => {
      if (!comments) {
        return res.status(404).send({ msg: "Article not found" });
      }
      res.status(200).send({ comments });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = { getSingleArticleComments };
