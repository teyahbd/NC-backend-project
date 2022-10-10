const { fetchCategories } = require("../models/categories.models");

exports.getCategories = (req, res) => {
  fetchCategories().then((categories) => {
    console.log(categories);
    res.status(200).send({ categories });
  });
};
