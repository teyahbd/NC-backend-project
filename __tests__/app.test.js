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
      describe("/:slug", () => {
        describe("GET /api/categories/:slug", () => {
          test("200: responds with category object", () => {
            return request(app)
              .get("/api/categories/social%20deduction")
              .expect(200)
              .then(({ body: { category } }) => {
                expect(category).toEqual({
                  slug: "social deduction",
                  description:
                    "Players attempt to uncover each other's hidden role",
                });
              });
          });
        });
      });
      describe("Endpoint Error Handling", () => {
        test("404: responds with error when passed endpoint category that does not exist", () => {
          return request(app)
            .get("/api/categories/notacategory")
            .expect(404)
            .then(({ body }) => {
              expect(body.message).toBe("Not found");
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
    describe("/comments", () => {
      describe("/:comment_id", () => {
        describe("GET: /api/comments/:comment_id", () => {
          test("200: responds with comment object of given comment id", () => {
            return request(app)
              .get("/api/comments/1")
              .expect(200)
              .then(({ body: { comment } }) => {
                expect(comment).toEqual(
                  expect.objectContaining({
                    comment_id: 1,
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    review_id: expect.any(Number),
                  })
                );
              });
          });
        });
        describe("DELETE: /api/comments/:comment_id", () => {
          test("204: responds with no content", () => {
            return request(app).delete("/api/comments/1").expect(204);
          });
        });
      });
      describe("Endpoint Error Handling", () => {
        test("400: responds with error when passed an invalid id", () => {
          return request(app)
            .delete("/api/comments/notAnId")
            .expect(400)
            .then(({ body: { message } }) => {
              expect(message).toBe("Bad request");
            });
        });
        test("404: responds with error when passed id that does not exist", () => {
          return request(app)
            .delete("/api/comments/100")
            .expect(404)
            .then(({ body: { message } }) => {
              expect(message).toBe("Not found");
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
        describe("Queries", () => {
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
              .get("/api/reviews?category=children's%20games")
              .expect(200)
              .then(({ body: reviews }) => {
                expect(reviews).toHaveLength(0);
              });
          });
          test("200: accepts sort_by query that defaults order to descending", () => {
            return request(app)
              .get("/api/reviews?sort_by=designer")
              .expect(200)
              .then(({ body: reviews }) => {
                expect(reviews).toHaveLength(13);

                expect(reviews).toBeSortedBy("designer", {
                  descending: true,
                });
              });
          });
          test("200: accepts order query that defaults column to date", () => {
            return request(app)
              .get("/api/reviews?order=asc")
              .expect(200)
              .then(({ body: reviews }) => {
                expect(reviews).toHaveLength(13);

                expect(reviews).toBeSortedBy("created_at", {
                  descending: false,
                });
              });
          });
          test("200: accepts order and sort query", () => {
            return request(app)
              .get("/api/reviews?sort_by=designer&order=asc")
              .expect(200)
              .then(({ body: reviews }) => {
                expect(reviews).toHaveLength(13);

                expect(reviews).toBeSortedBy("designer", { descending: false });
              });
          });
          test("200: accepts order, sort and category query", () => {
            return request(app)
              .get(
                "/api/reviews?category=social%20deduction&sort_by=review_body&order=asc"
              )
              .expect(200)
              .then(({ body: reviews }) => {
                expect(reviews).toHaveLength(11);

                expect(reviews).toBeSortedBy("review_body", {
                  descending: false,
                });

                reviews.forEach((review) => {
                  expect(review).toEqual(
                    expect.objectContaining({
                      category: "social deduction",
                    })
                  );
                });
              });
          });
        });
      });
      describe("Error Handling", () => {
        test("404: returns error message when passed category query that does not exist", () => {
          return request(app)
            .get("/api/reviews?category=not_a_category")
            .expect(404)
            .then(({ body: { message } }) => {
              expect(message).toBe("Not found");
            });
        });
        test("400: returns error message when passed invalid sort_by query value", () => {
          return request(app)
            .get("/api/reviews?sort_by=not_a_column")
            .expect(400)
            .then(({ body: { message } }) => {
              expect(message).toBe("Bad request");
            });
        });
        test("400: returns error message when passed invalid order query value", () => {
          return request(app)
            .get("/api/reviews?order=not_asc")
            .expect(400)
            .then(({ body: { message } }) => {
              expect(message).toBe("Bad request");
            });
        });
        test("400: returns error message when one of multiple queries has invalid value", () => {
          return request(app)
            .get(
              "/api/reviews?category=social%20deduction&sort_by=review_body&order=not_asc"
            )
            .expect(400)
            .then(({ body: { message } }) => {
              expect(message).toBe("Bad request");
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
        describe(" Endpoint Error Handling", () => {
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
          describe("GET: /api/reviews/:review_id/comments", () => {
            test("200: responds with an array of comment objects", () => {
              return request(app)
                .get("/api/reviews/2/comments")
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).toHaveLength(3);

                  comments.forEach((comment) => {
                    expect(comment).toEqual(
                      expect.objectContaining({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        review_id: 2,
                      })
                    );
                  });
                });
            });
            test("200: responds with an array of comment objects with most recent first", () => {
              return request(app)
                .get("/api/reviews/3/comments")
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).toHaveLength(3);

                  const sortedComments = comments.map((comment) => {
                    return { ...comment };
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

                  sortedComments.sort(compareDates);

                  expect(comments).toStrictEqual(sortedComments);
                });
            });
            test("200: returns empty array where review exists but has no comments", () => {
              return request(app)
                .get("/api/reviews/1/comments")
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).toHaveLength(0);
                });
            });
          });
          describe("Error Handling", () => {
            test("400: responds with error when passed an invalid id", () => {
              return request(app)
                .get("/api/reviews/notAnId/comments")
                .expect(400)
                .then(({ body: { message } }) => {
                  expect(message).toBe("Bad request");
                });
            });
            test("404: responds with error when passed id that does not exist", () => {
              return request(app)
                .get("/api/reviews/100/comments")
                .expect(404)
                .then(({ body: { message } }) => {
                  expect(message).toBe("Review not found");
                });
            });
          });
        });
        describe("/comments", () => {
          describe("POST: /api/reviews/:review_id/comments", () => {
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
            test("201: ignores any additional keys on request body and completes post request successfully", () => {
              const commentToPost = {
                username: "mallionaire",
                body: "I love this game!",
                votes: 4,
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
            });
          });
        });
      });
    });
    describe("/api Endpoint Error Handling ", () => {
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
