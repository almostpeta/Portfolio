import jwt from "jsonwebtoken";
import config from "./config.js";
import { ROLES } from "./constants.js";

export function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token)
    return res.status(403).send({ auth: false, message: "No token provided." });
  const bearer = token.split(" ");
  const bearerToken = bearer[1];
  jwt.verify(bearerToken, config.secret, function (err, decoded) {
    if (err)
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });

    // if everything good, save to request for use in other routes
    req.user = decoded;
    next();
  });
}

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== ROLES.ADMIN) {
    return res.status(403).send({
      error: "Access forbidden",
      message: "You don't have the correct access to perform this action",
    });
  }

  next();
};

export const forbiddenForOperator = (req, res, next) => {
  if (req.user?.role === ROLES.OPERATOR) {
    return res.status(403).send({
      error: "Access forbidden",
      message: "You don't have the correct access to perform this action",
    });
  }

  next();
};
