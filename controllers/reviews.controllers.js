const {
  fetchReviewById,
  updateReviewById,
  fetchReviews,
  addComment,
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

exports.getReviews = (req, res, next) => {
  fetchReviews(req.query.category)
    .then((reviews) => {
      res.status(200).send(reviews);
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  addComment(req.params.review_id, req.body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
