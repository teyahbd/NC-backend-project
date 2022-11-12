const reviewsRouter = require("express").Router();
const {
  getReviewByReviewId,
  patchReviewByReviewId,
  getReviews,
  getCommentsByReviewId,
  postCommentByReviewId,
} = require("../controllers/reviews.controllers");

reviewsRouter.route("/").get(getReviews);

reviewsRouter
  .route("/:review_id")
  .get(getReviewByReviewId)
  .patch(patchReviewByReviewId);

reviewsRouter
  .route("/:review_id/comments")
  .get(getCommentsByReviewId)
  .post(postCommentByReviewId);

module.exports = reviewsRouter;
