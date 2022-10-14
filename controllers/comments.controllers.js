const { removeCommentById } = require("../models/comments.models");

exports.deleteCommentById = (req, res, next) => {
  console.log("controller");
  removeCommentById(req.params.comment_id).then(() => {
    res.status(404).send();
  });
};
