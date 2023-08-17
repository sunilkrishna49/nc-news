const { fetchArticles } = require("../models/apiArticlesModel");

const getArticles = (request, response) => {
  return fetchArticles().then((articles) => {
    response.status(200).send({ articles });
  });
};

module.exports = { getArticles };
