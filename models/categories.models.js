const db = require("../db/connection");

exports.fetchCategories = () => {
  return db.query(`SELECT * FROM categories`).then(({ rows: categories }) => {
    return categories;
  });
};

exports.fetchCategoryBySlug = (slug) => {
  const promises = [
    db.query(`SELECT * FROM categories WHERE slug=$1`, [slug]),
    this.fetchCategories(),
  ];
  return Promise.all(promises).then(
    ([{ rows: queryCategory }, allCategories]) => {
      const containsCategory = allCategories.some((cat) => cat.slug === slug);

      if (queryCategory.length === 0 && !containsCategory) {
        return Promise.reject({
          status: 404,
          message: "Not found",
        });
      } else {
        return queryCategory;
      }
    }
  );
};
