const db = require("../db/connection");
const format = require("pg-format");

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
          message: "Review not found",
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

exports.fetchReviews = ({ category, sort_by, order }) => {
  const validCategoryValues = [
    "euro_game",
    "social_deduction",
    "dexterity",
    "childrens_games",
    undefined,
  ];

  const validSortByValues = [
    "title",
    "designer",
    "owner",
    "review_img_url",
    "review_body",
    "category",
    "created_at",
    "votes",
    undefined,
  ];

  const validOrderValues = ["asc", "desc", undefined];

  if (
    !validCategoryValues.includes(category) ||
    !validSortByValues.includes(sort_by) ||
    !validOrderValues.includes(order)
  ) {
    return Promise.reject({ status: 400, message: "Bad request" });
  }

  const queryValues = [];

  let queryStr = `SELECT reviews.*, COUNT(comments.comment_id)::int as comment_count
  FROM reviews
  LEFT JOIN comments ON reviews.review_id=comments.review_id`;

  if (category !== undefined) {
    category = category.replace(/_/g, " ");
    queryStr += ` WHERE reviews.category=$1`;
    queryValues.push(category);
  }

  queryStr += ` GROUP BY reviews.review_id`;

  if (sort_by !== undefined) {
    if (order === "asc") {
      queryStr += ` ORDER BY reviews.${sort_by} ASC;`;
    } else {
      queryStr += ` ORDER BY reviews.${sort_by} DESC;`;
    }
  } else if (order !== undefined) {
    if (order === "asc") {
      queryStr += ` ORDER BY reviews.created_at ASC;`;
    } else {
      queryStr += ` ORDER BY reviews.created_at DESC;`;
    }
  } else {
    queryStr += ` ORDER BY reviews.created_at DESC;`;
  }

  return db.query(queryStr, queryValues).then(({ rows: reviews }) => {
    return reviews;
  });
};

exports.addComment = (review_id, reqBody) => {
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
