const express = require("express");

const { getCategories } = require("./controllers/categories.controllers");
const {
  getReviewById,
  patchReviewById,
} = require("./controllers/reviews.controllers");
const { getUsers } = require("./controllers/users.controllers");
const {
  handlePSQLErrors,
  handleCustomErrors,
  handleInternalErrors,
  handleInvalidRouteErrors,
} = require("./controllers/errors.controllers");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/users", getUsers);
app.get("/api/reviews/:review_id", getReviewById);

app.patch("/api/reviews/:review_id", patchReviewById);

app.all("*", handleInvalidRouteErrors);

app.use(handlePSQLErrors);

app.use(handleCustomErrors);

app.use(handleInternalErrors);

module.exports = app;
