const { fetchUsers, updateUserByUsername } = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.patchUserByUsername = (req, res, next) => {
  console.log("controller");
  updateUserByUsername(req.params.username, req.body.vote_increments)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
