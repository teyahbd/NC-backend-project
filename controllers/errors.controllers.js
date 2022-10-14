exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ message: "Bad request" });
  } else if (err.code === "23503") {
    res.status(404).send({ message: "Not found" });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.message });
  } else next(err);
};

exports.handleInternalErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "Server error" });
};

exports.handleInvalidRouteErrors = (req, res) => {
  res.status(404).send({ message: "Invalid route" });
};
