const db = require("../db/connection");

exports.fetchCategories = () => {
  return db.query(`SELECT * FROM categories`).then(({ rows: categories }) => {
    return categories;
  });
};

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows: users }) => {
    return users;
  });
};
