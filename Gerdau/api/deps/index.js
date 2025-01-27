const logger = require("./logger");

const isDev = process.env.NODE_ENV !== "production";

const deps = {
  isDev,
  logger,
};

module.exports = deps;
