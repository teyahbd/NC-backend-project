const db = require("../db/connection");

exports.fetchReviewById = (review_id) => {
  return db
    .query(
      `SELECT reviews.*, (SELECT COUNT(*)::int FROM comments WHERE review_id=$1) AS comment_count FROM reviews WHERE review_id=$1;`,
      [review_id]
    )
    .then(({ rows: [review] }) => {
      if (!review) {
        return Promise.reject({
          status: 404,
          message: `No review found with review id: ${review_id}`,
        });
      }
      return review;
    });
};

exports.updateReviewById = (review_id, inc_votes = "undefined") => {
  return db
    .query(
      `UPDATE reviews SET votes= votes + $1 WHERE review_id=$2 RETURNING *;`,
      [inc_votes, review_id]
    )
    .then(({ rows: [review] }) => {
      if (!review) {
        return Promise.reject({
          status: 404,
          message: `No review found with review id: ${review_id}`,
        });
      }
      return review;
    });
};

exports.fetchCommentsByReviewId = (review_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE review_id=$1 ORDER BY created_at DESC`,
      [review_id]
    )
    .then(({ rows: comments }) => {
      return comments;
    });
};
