const { updateArticlesVotes } = require("../models/patchApiArticleByIdModel");

function patchArticleVotes(req, res, next) {
  const articleId = req.params.article_id;
  const { inc_votes } = req.body;

  updateArticlesVotes(articleId, inc_votes)
    .then((updatedArticle) => {
      res.status(200).send({ article: updatedArticle });
    })
    .catch((error) => {
      next(error);
    });
}
module.exports = { patchArticleVotes };
