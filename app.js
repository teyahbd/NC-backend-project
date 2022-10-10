const express = require("express");

const { getCategories } = require("./controllers/categories.controllers");

const app = express();

app.get("/api/categories", getCategories);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Invalid route!" });
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Server error!" });
});

module.exports = app;
