const {
  fetchCategories,
  fetchUsers,
  fetchReviewById,
} = require("../models/categories.models");

exports.getCategories = (req, res) => {
  fetchCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};

exports.getReviewById = (req, res, next) => {
  fetchReviewById(req.params.review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.getUsers = (req, res) => {
  fetchUsers().then((users) => {
    res.status(200).send({ users });
  });
};
