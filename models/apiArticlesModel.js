const db = require("../db/connection");

const fetchArticles = () => {
  return db
    .query(
      `SELECT 
      a.author,
      a.title,
      a.article_id,
      a.topic,
      a.created_at,
      a.votes,
      a.article_img_url,
      COUNT(c.article_id) AS comment_count
    FROM articles AS a
    LEFT JOIN comments AS c ON a.article_id = c.article_id
    GROUP BY
      a.author,
      a.title,
      a.article_id,
      a.topic,
      a.created_at,
      a.votes,
      a.article_img_url
    ORDER BY a.created_at DESC;
  `
    )
    .then(({ rows }) => {
      return rows;
    });
};

module.exports = { fetchArticles };
