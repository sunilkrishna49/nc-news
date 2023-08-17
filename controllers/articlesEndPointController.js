const { getArticleById } = require("../models/articlesEndPointModel");

const getSinlgeArticle = (req, res, next) => {
  const articleID = req.params.article_id;

  // if (isNaN(articleID)) {
  //   return res.status(400).send({ msg: "Bad Request" });
  // }
  getArticleById(articleID)
    .then((article) => {
      if (!article) {
        return res.status(404).send({ msg: "Article not found" });
      }

      res.status(200).send({ article });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = { getSinlgeArticle };
