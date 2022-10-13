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

exports.fetchReviews = (category) => {
  const validCategoryValues = [
    "euro_game",
    "social_deduction",
    "dexterity",
    "childrens_games",
  ];

  const queryValues = [];

  let queryStr = `SELECT reviews.*, COUNT(comments.comment_id)::int as comment_count
  FROM reviews
  LEFT JOIN comments ON reviews.review_id=comments.review_id`;

  if (category) {
    console.log(category);
    if (!validCategoryValues.includes(category)) {
      return Promise.reject({ status: 400, message: "Invalid category" });
    }
    queryStr += ` WHERE reviews.category=$1`;
    queryValues.push(category);
  }

  queryStr += ` GROUP BY reviews.review_id
  ORDER BY reviews.created_at DESC;`;

  return db.query(queryStr, queryValues).then(({ rows: reviews }) => {
    return reviews;
  });
};
