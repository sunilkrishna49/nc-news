const db = require("../db/connection");

const getArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      return rows[0];
    });
};

module.exports = { getArticleById };
