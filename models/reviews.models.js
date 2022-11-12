const db = require("../db/connection");

exports.fetchReviewByReviewId = (review_id) => {
  return db
    .query(
      `SELECT reviews.*, (SELECT COUNT(*)::int FROM comments WHERE review_id=$1) AS comment_count FROM reviews WHERE review_id=$1;`,
      [review_id]
    )
    .then(({ rows: [review] }) => {
      if (!review) {
        return Promise.reject({
          status: 404,
          message: "Review not found",
        });
      }
      return review;
    });
};

exports.updateReviewByReviewId = (review_id, inc_votes = "undefined") => {
  return db
    .query(
      `UPDATE reviews SET votes= votes + $1 WHERE review_id=$2 RETURNING *;`,
      [inc_votes, review_id]
    )
    .then(({ rows: [review] }) => {
      if (!review) {
        return Promise.reject({
          status: 404,
          message: "Review not found",
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

exports.fetchReviews = (category, sort_by = "created_at", order = "desc") => {
  const validSortByValues = [
    "title",
    "designer",
    "owner",
    "review_img_url",
    "review_body",
    "category",
    "created_at",
    "votes",
  ];

  const validOrderValues = ["asc", "desc"];

  if (sort_by) {
    if (!validSortByValues.includes(sort_by)) {
      return Promise.reject({ status: 400, message: "Bad request" });
    }
  }

  if (order) {
    if (!validOrderValues.includes(order)) {
      return Promise.reject({ status: 400, message: "Bad request" });
    }
  }

  const queryValues = [];

  let queryStr = `SELECT reviews.*, COUNT(comments.comment_id)::int as comment_count
  FROM reviews
  LEFT JOIN comments ON reviews.review_id=comments.review_id`;

  if (category) {
    queryStr += ` WHERE reviews.category=$1`;
    queryValues.push(category);
  }

  queryStr += ` GROUP BY reviews.review_id ORDER BY reviews.${sort_by} ${order};`;

  return db.query(queryStr, queryValues).then(({ rows: reviews }) => {
    return reviews;
  });
};

exports.addCommentByReviewId = (review_id, reqBody) => {
  const { username, body } = reqBody;
  return db
    .query(
      `INSERT INTO comments (body, review_id, author) VALUES ($1, $2, $3) RETURNING *`,
      [body, review_id, username]
    )
    .then(({ rows: [comment] }) => {
      return comment;
    });
};
