const commentsRouter = require("express").Router();
const {
  deleteCommentByCommentId,
  getCommentByCommentId,
} = require("../controllers/comments.controllers");

commentsRouter
  .route("/:comment_id")
  .get(getCommentByCommentId)
  .delete(deleteCommentByCommentId);

module.exports = commentsRouter;
