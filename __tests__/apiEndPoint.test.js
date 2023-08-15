const request = require("supertest");
const app = require("../app");
const endpointsData = require("../endpoints.json");

describe("app", () => {
  describe("get /api", () => {
    test("return request 200: return status code", () => {
      return request(app).get("/api").expect(200);
    });
    test("should return an object describing all available endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(endpointsData);
        });
    });
  });
});
