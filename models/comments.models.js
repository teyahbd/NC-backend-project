const db = require("../db/connection");

exports.removeCommentById = (comment_id) => {
  console.log("model");
  return db
    .query(`DELETE FROM comments WHERE comment_id=$1`, [comment_id])
    .then((response) => {
      return response;
    });
};
