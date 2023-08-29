const db = require("../db/connection");

function updateArticlesVotes(articleId, incVotes) {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [incVotes, articleId]
    )
    .then((rows) => {
      return rows[0];
    });
}
module.exports = { updateArticlesVotes };
