const { deleteCommentById } = require("../models/deleteCommentsByIdModel");

const deleteCommentByIdController = (req, res, next) => {
  const commentID = req.params.comment_id;
  deleteCommentById(commentID).then((comment) => {});
};

module.exports = { deleteCommentByIdController };
