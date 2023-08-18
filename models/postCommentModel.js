const db = require("../db/connection");

const addCommentToArticle = (article_id, username, body) => {
  return db
    .query(
      `INSERT INTO comments (article_id,author,body) VALUES ($1,$2,$3) RETURNING *`,
      [article_id, username, body]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }

      return rows[0];
    });
};

module.exports = { addCommentToArticle };
