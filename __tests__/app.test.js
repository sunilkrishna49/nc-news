const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const endpointsData = require("../endpoints.json");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});
//Ticket 2
describe("app", () => {
  describe("get /api/topics", () => {
    test("return request 200: returns status code", () => {
      return request(app).get("/api/topics").expect(200);
    });
    test("return topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          const { topics } = response.body;
          expect(Array.isArray(topics)).toBe(true);
          expect(topics.length).toBe(3);
          topics.forEach((topic) => {
            expect(topic).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
        });
    });
  });

  //Ticket 3
  describe("CORE: GET /api", () => {
    test("should return an object describing all available endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(endpointsData);
        });
    });
  });

  //Ticket 4

  describe("GET /api/articles/:article_id", () => {
    test("return request 200: returns status code", () => {
      const articleID = 1;
      return request(app).get(`/api/articles/${articleID}`).expect(200);
    });

    test("should return an article by its id", () => {
      const articleID = 1;
      const expectedArticle = {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      };
      return request(app)
        .get(`/api/articles/${articleID}`)
        .expect(200)
        .then((response) => {
          const { article } = response.body;
          expect(article).toMatchObject(expectedArticle);
        });
    });

    test("returns 400 status for invalid input", () => {
      const article_id = "Hello";
      return request(app)
        .get(`/api/articles/${article_id}`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });

    test("returns 404 status code for non-existent article", () => {
      const article_id = 9999;
      return request(app)
        .get(`/api/articles/${article_id}`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found");
        });
    });
  });

  //Ticket 5

  describe("get api/articles", () => {
    test("return request 200: returns status code", () => {
      return request(app).get("/api/articles").expect(200);
    });

    test("return articles with correct properties ", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          expect(Array.isArray(articles)).toBe(true);
          expect(articles.length).toBe(13);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
            });
          });
        });
    });

    test("does not contain body property", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          articles.forEach((article) => {
            expect(article.body).toBeUndefined();
          });
        });
    });

    test("should have a comment_count property for every article", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          articles.forEach((article) => {
            expect(article).toHaveProperty("comment_count");
          });
        });
    });
    test("should have the correct comment_count for each article", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          expect(articles[0].comment_count).toBe("2");
        });
    });

    test("articles should be sorted by date in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          const dates = articles.map((article) => {
            return new Date(article.created_at);
          });
          for (let i = 0; i < dates.length - 1; i++) {
            expect(dates[i].getTime()).toBeGreaterThanOrEqual(
              dates[i + 1].getTime()
            );
          }
        });
    });

    //Ticket 6

    describe("GET /api/articles/:article_id/comments", () => {
      test("responds with 200: returns status code", () => {
        const article_id = 1;
        return request(app)
          .get(`/api/articles/${article_id}/comments`)
          .expect(200);
      });
      test("200: Returns comments with correct properties for the particular article", () => {
        const article_id = 1;
        return request(app)
          .get(`/api/articles/${article_id}/comments`)
          .expect(200)
          .then((response) => {
            const { comments } = response.body;
            expect(Array.isArray(comments)).toBe(true);
            expect(comments.length).not.toBe(0);
            comments.forEach((comment) => {
              expect(comment).toMatchObject({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                article_id: expect.any(Number),
              });
            });
          });
      });
      test("200: Returns comments sorted by date in descending order", () => {
        const article_id = 1;
        return request(app)
          .get(`/api/articles/${article_id}/comments`)
          .expect(200)
          .then((response) => {
            const { comments } = response.body;
            const dates = comments.map((comment) => {
              return new Date(comment.created_at);
            });
            for (let i = 0; i < dates.length - 1; i++) {
              expect(dates[i].getTime()).toBeGreaterThanOrEqual(
                dates[i + 1].getTime()
              );
            }
          });
      });
      test("return 400 for invalid article ID", () => {
        const article_id = "Hello";

        return request(app)
          .get(`/api/articles/${article_id}/comments`)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
          });
      });

      test("return 404 for a non-existent article", () => {
        const article_id = 9999;
        return request(app).get(`/api/articles/${article_id}/comments`);
        expect(404).then(({ body }) => {
          expect(body.msg).toBe("Article not found");
        });
      });

      // test.only("returns 200 if an article has no comments", () => {
      //   const article_id = 8;
      //   return request(app)
      //     .get(`/api/articles/${article_id}/comments`)
      //     .expect(200)
      //     .then(({ body }) => {
      //       expect(body.comments).toEqual([]);
      //     });
      // });
    });
  });

  // Ticket 7

  describe("CORE: POST /api/articles/:article_id/comments", () => {
    test("responds with 201 and the posted comment", () => {
      const article_id = 1;
      const newComment = {
        username: "butter_bridge",
        body: "This is a new comment",
      };
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          const comment = body.comment;
          expect(comment).toHaveProperty("body", newComment.body);
          expect(comment).toHaveProperty("article_id", article_id);
          expect(comment).toHaveProperty("author", newComment.username);
          expect(comment).toHaveProperty("votes", 0);
          expect(comment).toHaveProperty("created_at");
        });
    });
    test("returns 400 for invalid article id ", () => {
      const article_id = "bananas";
      const newComment = {
        username: "butter_bridge",
        body: "This is a new comment",
      };
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test("returns 404 for article id not found in the database ", () => {
      const article_id = 9999;
      const newComment = {
        username: "butter_bridge",
        body: "This is a new comment",
      };
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Violation of foreign key");
        });
    });
    test("responds with 201 and the posted comment while ignoring extra properties", () => {
      const article_id = 1;
      const newComment = {
        username: "butter_bridge",
        body: "This is a new comment",
        extraProperty: "someValue",
      };
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          const comment = body.comment;
          expect(comment).toHaveProperty("body", newComment.body);
          expect(comment).toHaveProperty("article_id", article_id);
          expect(comment).toHaveProperty("author", newComment.username);
          expect(comment).toHaveProperty("votes", 0);
          expect(comment).toHaveProperty("created_at");
          expect(comment).not.toHaveProperty("extraProperty");
        });
    });
    test("returns 400 when required fields are missing ", () => {
      const article_id = 1;
      const newComment = {};
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test("returns 404 when the given username is not found", () => {
      const article_id = 1;
      const newComment = {
        username: "sunil",
        body: "This is a new comment",
      };
      return request(app)
        .post(`/api/articles/${article_id}/comments`)
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Violation of foreign key");
        });
    });
  });
  //Ticket 8
  describe("CORE: PATCH /api/articles/:article_id", () => {
    test.only("return 200: returns status code for a patch request", () => {
      const article_id = 1;
      const updateData = { inc_votes: 5 };
      return request(app)
        .patch(`/api/articles/${article_id}`)
        .send(updateData)
        .expect(200);
    });
    test.only("Updates an article's votes and responds with the updated article", () => {});
  });

  //Ticket 9
  describe("CORE: DELETE /api/comments/:comment_id", () => {
    test("should return status code of 201", () => {
      const comment_id = 1;
      return request(app).delete(`/api/comments/${comment_id}`);
      expect(response.status).toBe(201);
    });
    test("deletes the comment and responds with status 204", () => {
      const comment_id = 1;
      return request(app).delete(`/api/comments/${comment_id}`);
      expect(204).then((body) => {
        expect(body.msg).toBe("no content");
      });
    });
    test("responds with a status 404 for deleting a non-existent comment", () => {
      const comment_id = "nonexistenceid";
      return request(app).delete(`/api/comments/${comment_id}`);
      expect(response.status).toBe(404);
    });
    test("responds with a status 400 for deleting with a invalid comment id", () => {
      const comment_id = "bananas";
      return request(app).delete(`/api/comments/${comment_id}`);
      expect(response.status).toBe(400);
    });
  });

  //Ticket 10
  describe("get /api/users", () => {
    test("return request 200: returns status code", () => {
      return request(app).get("/api/users").expect(200);
    });
    test("return users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          const { users } = response.body;
          expect(Array.isArray(users)).toBe(true);
          expect(users.length).toBe(4);
          users.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });
  });
});
