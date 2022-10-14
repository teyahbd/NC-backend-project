const {
  removeCommentById,
  fetchCommentById,
} = require("../models/comments.models");

exports.deleteCommentById = (req, res, next) => {
  const promises = [
    fetchCommentById(req.params.comment_id),
    removeCommentById(req.params.comment_id),
  ];

  return Promise.all(promises)
    .then((promises) => {
      res.status(204).send();
    })
    .catch(next);
};
