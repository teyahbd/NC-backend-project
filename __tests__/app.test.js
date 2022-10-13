const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const app = require("../app.js");
const request = require("supertest");
const {
  categoryData,
  commentData,
  reviewData,
  userData,
} = require("../db/data/test-data");

beforeEach(() => seed({ categoryData, commentData, reviewData, userData }));

afterAll(() => db.end());

describe("app", () => {
  describe("/api", () => {
    describe("/categories", () => {
      describe("GET: /api/categories", () => {
        test("200: responds with array of category objects", () => {
          return request(app)
            .get("/api/categories")
            .expect(200)
            .then(({ body: { categories } }) => {
              expect(categories).toHaveLength(4);

              categories.forEach((category) => {
                expect(category).toEqual(
                  expect.objectContaining({
                    slug: expect.any(String),
                    description: expect.any(String),
                  })
                );
              });
            });
        });
      });
    });
    describe("/reviews", () => {
      describe("GET: /api/reviews", () => {
        test("200: responds with an array of review objects when not passed query", () => {
          return request(app)
            .get("/api/reviews")
            .expect(200)
            .then(({ body: reviews }) => {
              expect(reviews).toHaveLength(13);

              reviews.forEach((review) => {
                expect(review).toEqual(
                  expect.objectContaining({
                    owner: expect.any(String),
                    title: expect.any(String),
                    review_id: expect.any(Number),
                    category: expect.any(String),
                    review_img_url: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    designer: expect.any(String),
                    comment_count: expect.any(Number),
                  })
                );
              });
            });
        });
        test("200: responds with an array of review objects sorted by date in descending order when not passed query", () => {
          return request(app)
            .get("/api/reviews")
            .expect(200)
            .then(({ body: reviews }) => {
              expect(reviews).toHaveLength(13);

              const sortedReviews = reviews.map((review) => {
                return { ...review };
              });

              function compareDates(a, b) {
                if (a.created_at > b.created_at) {
                  return -1;
                }
                if (a.created_at < b.created_at) {
                  return 1;
                }
                return 0;
              }

              sortedReviews.sort(compareDates);

              expect(reviews).toStrictEqual(sortedReviews);
            });
        });
        test("200: accepts category query", () => {
          return request(app)
            .get("/api/reviews?category=dexterity")
            .expect(200)
            .then(({ body: reviews }) => {
              expect(reviews).toHaveLength(1);

              expect(reviews).toEqual([
                {
                  review_id: 2,
                  title: "Jenga",
                  designer: "Leslie Scott",
                  owner: "philippaclaire9",
                  review_img_url:
                    "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                  review_body: "Fiddly fun for all the family",
                  category: "dexterity",
                  created_at: "2021-01-18T10:01:41.251Z",
                  votes: 5,
                  comment_count: 3,
                },
              ]);
            });
        });
        test("200: returns empty array when passed category that exists but has no associated reviews", () => {
          return request(app)
            .get("/api/reviews?category=childrens_games")
            .expect(200)
            .then(({ body: reviews }) => {
              expect(reviews).toHaveLength(0);
            });
        });
        test("400: returns error message when passed invalid category query value", () => {
          return request(app)
            .get("/api/reviews?category=not_a_category")
            .expect(400)
            .then(({ body: { message } }) => {
              expect(message).toBe("Invalid category");
            });
        });
      });
      describe("/:review_id", () => {
        describe("GET: /api/reviews/:review_id", () => {
          test("200: responds with a review object that has given review id", () => {
            return request(app)
              .get("/api/reviews/2")
              .expect(200)
              .then(({ body: { review } }) => {
                expect(review).toEqual(
                  expect.objectContaining({
                    review_id: 2,
                    title: expect.any(String),
                    review_body: expect.any(String),
                    designer: expect.any(String),
                    review_img_url: expect.any(String),
                    votes: expect.any(Number),
                    category: expect.any(String),
                    owner: expect.any(String),
                    created_at: expect.any(String),
                  })
                );
                expect(review).toMatchObject({
                  review_id: 2,
                  title: "Jenga",
                  designer: "Leslie Scott",
                  owner: "philippaclaire9",
                  review_img_url:
                    "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                  review_body: "Fiddly fun for all the family",
                  category: "dexterity",
                  created_at: "2021-01-18T10:01:41.251Z",
                  votes: 5,
                });
              });
          });
          test("200: responds with review object of given review id with a comment count", () => {
            return request(app)
              .get("/api/reviews/2")
              .expect(200)
              .then(({ body: { review } }) => {
                expect(review).toEqual({
                  review_id: 2,
                  title: "Jenga",
                  designer: "Leslie Scott",
                  owner: "philippaclaire9",
                  review_img_url:
                    "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                  review_body: "Fiddly fun for all the family",
                  category: "dexterity",
                  created_at: "2021-01-18T10:01:41.251Z",
                  votes: 5,
                  comment_count: 3,
                });
              });
          });
        });
        describe("PATCH: /api/reviews/:review_id", () => {
          test("200: responds with updated review object when vote increased", () => {
            const incReviewVotes = {
              inc_votes: 1,
            };

            return request(app)
              .patch("/api/reviews/1")
              .send(incReviewVotes)
              .expect(200)
              .then(({ body: { review } }) => {
                expect(review).toEqual({
                  review_id: 1,
                  title: "Agricola",
                  designer: "Uwe Rosenberg",
                  owner: "mallionaire",
                  review_img_url:
                    "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                  review_body: "Farmyard fun!",
                  category: "euro game",
                  created_at: "2021-01-18T10:00:20.514Z",
                  votes: 2,
                });
              });
          });
          test("200: responds with updated review object when vote decreased", () => {
            const decReviewVotes = {
              inc_votes: -3,
            };

            return request(app)
              .patch("/api/reviews/2")
              .send(decReviewVotes)
              .expect(200)
              .then(({ body: { review } }) => {
                expect(review).toEqual({
                  review_id: 2,
                  title: "Jenga",
                  designer: "Leslie Scott",
                  owner: "philippaclaire9",
                  review_img_url:
                    "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                  review_body: "Fiddly fun for all the family",
                  category: "dexterity",
                  created_at: "2021-01-18T10:01:41.251Z",
                  votes: 2,
                });
              });
          });
          test("400: responds with error when body is missing required fields", () => {
            const badBody = {};

            return request(app)
              .patch("/api/reviews/1")
              .send(badBody)
              .expect(400)
              .then(({ body: { message } }) => {
                expect(message).toBe("Bad request");
              });
          });
          test("400: responds with error when passed key value of wrong type", () => {
            const badBody = {
              inc_votes: "one vote",
            };

            return request(app)
              .patch("/api/reviews/1")
              .send(badBody)
              .expect(400)
              .then(({ body: { message } }) => {
                expect(message).toBe("Bad request");
              });
          });
        });

        describe("General Errors", () => {
          test("400: responds with error when passed an invalid id", () => {
            return request(app)
              .get("/api/reviews/notAnId")
              .expect(400)
              .then(({ body: { message } }) => {
                expect(message).toBe("Bad request");
              });
          });
          test("404: responds with error when passed id that does not exist", () => {
            return request(app)
              .get("/api/reviews/100")
              .expect(404)
              .then(({ body: { message } }) => {
                expect(message).toBe("Review not found");
              });
          });
        });
        describe("/comments", () => {
          describe("PATCH: /api/reviews/:review_id/comments", () => {
            test("201: responds with comment object that has been added to database", () => {
              const commentToPost = {
                username: "mallionaire",
                body: "I love this game!",
              };
              return request(app)
                .post("/api/reviews/1/comments")
                .send(commentToPost)
                .expect(201)
                .then(({ body: { comment } }) => {
                  expect(comment).toEqual({
                    comment_id: 7,
                    author: "mallionaire",
                    body: "I love this game!",
                    votes: 0,
                    review_id: 1,
                    created_at: expect.any(String),
                  });
                });
            });
            describe("Error Handling", () => {
              test("400: responds with error when passed an invalid id", () => {
                const commentToPost = {
                  username: "mallionaire",
                  body: "I love this game!",
                };

                return request(app)
                  .post("/api/reviews/notAnId/comments")
                  .send(commentToPost)
                  .expect(400)
                  .then(({ body: { message } }) => {
                    expect(message).toBe("Bad request");
                  });
              });
              test("400: responds with error when post body missing required fields", () => {
                const commentToPost = {
                  body: "I love this game!",
                };

                return request(app)
                  .post("/api/reviews/1/comments")
                  .send(commentToPost)
                  .expect(400)
                  .then(({ body: { message } }) => {
                    expect(message).toBe("Bad request");
                  });
              });
              test("404: responds with error when given username does not exist in the database", () => {
                const commentToPost = {
                  username: "teyahbd",
                  body: "I love this game!",
                };

                return request(app)
                  .post("/api/reviews/1/comments")
                  .send(commentToPost)
                  .expect(404)
                  .then(({ body: { message } }) => {
                    expect(message).toBe("Not found");
                  });
              });
              test("404: responds with error when passed id that does not exist", () => {
                const commentToPost = {
                  username: "mallionaire",
                  body: "I love this game!",
                };

                return request(app)
                  .post("/api/reviews/100/comments")
                  .send(commentToPost)
                  .expect(404)
                  .then(({ body: { message } }) => {
                    expect(message).toBe("Not found");
                  });
              });
              test("404: responds with error when passed route that does not exist", () => {
                const commentToPost = {
                  username: "mallionaire",
                  body: "I love this game!",
                };

                return request(app)
                  .post("/api/reviews/1/comment")
                  .send(commentToPost)
                  .expect(404)
                  .then(({ body: { message } }) => {
                    expect(message).toBe("Invalid route");
                  });
              });
            });
          });
        });
      });
    });
    describe("/users", () => {
      describe("GET: /api/users", () => {
        test("200: responds with array of user objects", () => {
          return request(app)
            .get("/api/users")
            .expect(200)
            .then(({ body: { users } }) => {
              expect(users).toHaveLength(4);

              users.forEach((user) => {
                expect(user).toEqual(
                  expect.objectContaining({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String),
                  })
                );
              });
            });
        });
      });
    });
    describe("Universal Error Handling ", () => {
      test("404: responds with error when passed a route that does not exist", () => {
        return request(app)
          .get("/api/badroute")
          .expect(404)
          .then(({ body }) => {
            expect(body.message).toBe("Invalid route");
          });
      });
    });
  });
});
