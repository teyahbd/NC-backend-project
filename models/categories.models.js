const db = require("../db/connection");

exports.fetchCategories = () => {
  return db.query(`SELECT * FROM categories`).then(({ rows: categories }) => {
    return categories;
  });
};

exports.fetchReviewById = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id=$1`, [review_id])
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

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows: users }) => {
    return users;
  });
};
