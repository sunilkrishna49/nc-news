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
});

//Ticket 3
describe("app", () => {
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
describe("app", () => {
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
  describe("app", () => {
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

      test("200: Returns an array of articles sorted by date in descending order with comment_count for every article", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then((response) => {
            const { articles } = response.body;
            const dates = articles.map((article) => {
              return article.created_at;
            });
            const expected = {
              author: "icellusedkars",
              title: "Eight pug gifs that remind me of mitch",
              article_id: 3,
              topic: "mitch",
              created_at: new Date("2020-11-03T09:12:00.000Z").toISOString(),
              votes: 0,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              comment_count: "2",
            };
            expect(articles[0]).toEqual(expected);
          });
      });
    });
  });
});

//Ticket 6
describe("app", () => {
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
  });
});

//Ticket 7
// describe("CORE: POST /api/articles/:article_id/comments", () => {
//   test("responds with 201 and the posted comment", () => {
//     const article_id = 1;
//     const newComment = {
//       username: "abc",
//       body: "this is new comment",
//     };
//     return request(app)
//       .post(`/api/articles/${article_id}/comments`)
//       .send()
//       .expect(201)
//       .then(({ response }) => {
//         console.log(response);
//       });
//   });
// });
