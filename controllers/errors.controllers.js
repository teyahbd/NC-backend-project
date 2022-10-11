exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Bad request" });
  } else next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  } else next(err);
};

exports.handleInternalErrors = (err, req, res, next) => {
  res.status(500).send({ message: "Server error" });
};

exports.handleInvalidRouteErrors = (req, res) => {
  res.status(404).send({ message: "Invalid route" });
};
