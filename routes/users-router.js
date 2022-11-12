const usersRouter = require("express").Router();
const {
  getUsers,
  patchUserByUsername,
} = require("../controllers/users.controllers");

usersRouter.route("/").get(getUsers);

usersRouter.route("/:username").patch(patchUserByUsername);

module.exports = usersRouter;
