const { getCommentsById } = require("../models/apiArticleIDCommentsModel");

const getSingleArticleComments = (req, res, next) => {
  const articleId = req.params.article_id;

  getCommentsById(articleId)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = { getSingleArticleComments };
