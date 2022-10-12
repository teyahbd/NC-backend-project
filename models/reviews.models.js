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

exports.fetchReviews = (queryObj) => {
  let queryStr = `SELECT reviews.*, COALESCE(count_table.comment_count, 0) as comment_count
  FROM reviews
  LEFT JOIN (SELECT review_id, COUNT(review_id)::int as comment_count
  FROM comments
  GROUP BY review_id) count_table ON reviews.review_id = count_table.review_id`;

  if (queryObj.category) {
    //sql injection??????
    queryStr += ` WHERE reviews.category='${queryObj.category}'`;
  }

  queryStr += ` ORDER BY reviews.created_at DESC;`;

  return db.query(queryStr).then(({ rows: reviews }) => {
    return reviews;
  });
};
