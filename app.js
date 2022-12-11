const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const apiRouter = require("./routes/api-router");
const {
  handlePSQLErrors,
  handleCustomErrors,
  handleInternalErrors,
  handleInvalidRouteErrors,
} = require("./controllers/errors.controllers");

app.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "public", "build", "index.html"));
});

app.get("/docs", (req, res, next) => {
  res.sendFile(path.join(__dirname, "public", "build", "docs.html"));
});

app.use("/api", apiRouter);

app.all("*", handleInvalidRouteErrors);
app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleInternalErrors);

module.exports = app;
