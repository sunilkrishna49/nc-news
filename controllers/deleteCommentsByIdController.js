const { deleteCommentById } = require("../models/deleteCommentsByIdModel");

const deleteCommentByIdController = (req, res, next) => {
  const commentID = req.params.comment_id;
  deleteCommentById(commentID)
    .then((deletedComment) => {
      if (deletedComment) {
        res.status(204).send();
      } else {
        res.status(404).send({ msg: "Comment not found" });
      }
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = { deleteCommentByIdController };
