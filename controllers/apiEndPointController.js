const endPointsData = require("../endpoints.json");

const getApiEndPoints = (req, res) => {
  res.json(endPointsData);
};

module.exports = { getApiEndPoints };
