const db = require("../db/connection");

const deleteCommentById = (comment_id) => {
  return db
    .query(`DELETE  FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({ rows }) => {
      console.log(rows);
      return rows[0];
    });
};

module.exports = { deleteCommentById };
