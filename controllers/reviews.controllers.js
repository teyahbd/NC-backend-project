const {
  fetchReviewById,
  updateReviewById,
  fetchCommentsByReviewId,
  fetchReviews,
} = require("../models/reviews.models");

exports.getReviewById = (req, res, next) => {
  fetchReviewById(req.params.review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.patchReviewById = (req, res, next) => {
  updateReviewById(req.params.review_id, req.body.inc_votes)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;

  const promises = [
    fetchCommentsByReviewId(review_id),
    fetchReviewById(review_id),
  ];

  Promise.all(promises)
    .then((promises) => {
      res.status(200).send({ comments: promises[0] });
    })
    .catch(next);
};

exports.getReviews = (req, res, next) => {
  fetchReviews(req.query.category)
    .then((reviews) => {
      res.status(200).send(reviews);
    })
    .catch(next);
};
