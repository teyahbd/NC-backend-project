const express = require("express");

const {
  getCategories,
  getReviewById,
} = require("./controllers/categories.controllers");

const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewById);

app.all("*", (req, res) => {
  res.status(404).send({ message: "Invalid route" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Bad request" });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  } else next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: "Server error" });
});

module.exports = app;
