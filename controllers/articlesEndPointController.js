const { getArticleById } = require("../models/articlesEndPointModel");

const getSinlgeArticle = (req, res, next) => {
  const articleID = req.params.article_id;
  console.log(articleID);

  getArticleById(articleID)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = { getSinlgeArticle };
