const db = require("../db/connection");

exports.fetchCommentByCommentId = (comment_id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id=$1`, [comment_id])
    .then(({ rows: comment }) => {
      if (comment.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Not found",
        });
      }
      return comment[0];
    });
};

exports.removeCommentByCommentId = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id=$1`, [comment_id])
    .then((response) => {
      return response;
    });
};
