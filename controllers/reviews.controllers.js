const {
  fetchReviewById,
  updateReviewById,
} = require("../models/reviews.models");

exports.getReviewById = (req, res, next) => {
  fetchReviewById(req.params.review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.patchReviewById = (req, res, next) => {
  updateReviewById(req.params.review_id, req.body)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};
