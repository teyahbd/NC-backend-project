const {
  fetchCategories,
  fetchCategoryBySlug,
} = require("../models/categories.models");

exports.getCategories = (req, res, next) => {
  fetchCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch(next);
};

exports.getCategoryBySlug = (req, res, next) => {
  fetchCategoryBySlug(req.params.slug)
    .then((category) => {
      res.status(200).send({ category });
    })
    .catch(next);
};
