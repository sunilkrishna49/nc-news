const { fetchTopics } = require("../models/topicsModels");

const getTopics = (request, response) => {
  return fetchTopics().then((topics) => {
    response.status(200).send({ topics });
  });
};

module.exports = { getTopics };
