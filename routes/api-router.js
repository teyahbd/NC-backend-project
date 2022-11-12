const apiRouter = require("express").Router();

const categoriesRouter = require("./categories-router");
const commentsRouter = require("./comments-router");
const usersRouter = require("./users-router");
const reviewsRouter = require("./reviews-router");

const endpoints = require("../endpoints.json");

apiRouter.get("/", (req, res, next) => {
  res.status(200).send(endpoints);
});

apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/reviews", reviewsRouter);

module.exports = apiRouter;
