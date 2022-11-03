const express = require("express");
const cors = require("cors");

const { getCategories } = require("./controllers/categories.controllers");
const {
  getReviewById,
  patchReviewById,
  getReviews,
  getCommentsByReviewId,
  postComment,
} = require("./controllers/reviews.controllers");
const {
  getUsers,
  patchUserByUsername,
} = require("./controllers/users.controllers");
const {
  handlePSQLErrors,
  handleCustomErrors,
  handleInternalErrors,
  handleInvalidRouteErrors,
} = require("./controllers/errors.controllers");
const { deleteCommentById } = require("./controllers/comments.controllers");

const app = express();
app.use(cors());

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/users", getUsers);
app.patch("/api/users/:user_id", patchUserByUsername);

app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.patch("/api/reviews/:review_id", patchReviewById);
app.post("/api/reviews/:review_id/comments", postComment);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.all("*", handleInvalidRouteErrors);

app.use(handlePSQLErrors);

app.use(handleCustomErrors);

app.use(handleInternalErrors);

module.exports = app;
