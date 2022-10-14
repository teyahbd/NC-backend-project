const {
  fetchReviewById,
  updateReviewById,
  fetchCommentsByReviewId,
  fetchReviews,
  addComment,
} = require("../models/reviews.models");
const { fetchCategoryBySlug } = require("../models/categories.models");

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
  const { category, sort_by, order } = req.query;
  const promises = [fetchReviews(category, sort_by, order)];

  if (category) {
    promises.push(fetchCategoryBySlug(category));
  }

  Promise.all(promises)
    .then((promises) => {
      res.status(200).send(promises[0]);
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
