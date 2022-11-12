const express = require("express");
const cors = require("cors");

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

app.use("/api", apiRouter);

app.all("*", handleInvalidRouteErrors);
app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleInternalErrors);

module.exports = app;
