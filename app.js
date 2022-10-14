const express = require("express");

const { getCategories } = require("./controllers/categories.controllers");
const {
  getReviewById,
  patchReviewById,
  getReviews,
  getCommentsByReviewId,
  postComment,
} = require("./controllers/reviews.controllers");
const { getUsers } = require("./controllers/users.controllers");
const {
  handlePSQLErrors,
  handleCustomErrors,
  handleInternalErrors,
  handleInvalidRouteErrors,
} = require("./controllers/errors.controllers");
const { deleteCommentById } = require("./controllers/comments.controllers");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/users", getUsers);

app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.patch("/api/reviews/:review_id", patchReviewById);
app.post("/api/reviews/:review_id/comments", postComment);
console.log("hi");
app.delete("/api/comments/:comment_id", deleteCommentById);
console.log("after");
app.all("*", handleInvalidRouteErrors);

app.use(handlePSQLErrors);

app.use(handleCustomErrors);

app.use(handleInternalErrors);

module.exports = app;
