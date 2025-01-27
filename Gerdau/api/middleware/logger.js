module.exports = ({ logger }) => {
  logger = logger.child({ service: "http" });
  return (req, res, next) => {
    logger.debug(`HTTP REQUEST ${req.path}`, {
      method: req.method,
      path: req.path,
      userAgent: req.headers["user-agent"],
    });

    next();
  };
};
