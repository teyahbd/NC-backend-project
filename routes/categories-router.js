const categoriesRouter = require("express").Router();
const {
  getCategories,
  getCategoryBySlug,
} = require("../controllers/categories.controllers");

categoriesRouter.route("/").get(getCategories);
categoriesRouter.route("/:slug").get(getCategoryBySlug);

module.exports = categoriesRouter;
