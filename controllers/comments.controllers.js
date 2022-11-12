const {
  removeCommentByCommentId,
  fetchCommentByCommentId,
} = require("../models/comments.models");

exports.getCommentByCommentId = (req, res, next) => {
  fetchCommentByCommentId(req.params.comment_id)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentByCommentId = (req, res, next) => {
  const promises = [
    fetchCommentByCommentId(req.params.comment_id),
    removeCommentByCommentId(req.params.comment_id),
  ];

  return Promise.all(promises)
    .then((promises) => {
      res.status(204).send();
    })
    .catch(next);
};
