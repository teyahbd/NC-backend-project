const db = require("../db/connection");

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows: users }) => {
    return users;
  });
};

exports.updateUserByUsername = (username, vote_increments) => {
  return db
    .query(
      `UPDATE users SET vote_increments = $1 WHERE username = $2 RETURNING *`,
      [vote_increments, username]
    )
    .then(({ rows }) => {
      if (!rows) {
        return Promise.reject({
          status: 404,
          message: "User not found",
        });
      }
      return rows;
    });
};
