const db = require("../db/connection");

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows: users }) => {
    return users;
  });
};

exports.patchUserByUsername = (username, vote_increments) => {
  return db
    .query(
      `UPDATE users SET vote_increments = $1 WHERE username = $2 RETURNING *`,
      [vote_increments, username]
    )
    .then(({ rows: [user] }) => {
      if (!user) {
        return Promise.reject({
          status: 404,
          message: "User not found",
        });
      }
      return user;
    });
};
