import path from "path";
import fs from "fs";
import sequelize from "../db/dbconection.js";

var JSZip = require("jszip");

export class Search {
  constructor(status, message, developerMessage, items) {
    this.status = status;
    this.message = message;
    this.developerMessage = developerMessage;
    this.items = items;
  }
}

export const catchAsync = (handler) => async (req, res, next) => {
  try {
    await handler(req, res, next);
  } catch (e) {
    res.status(e.status || 300).send(e.message || "Bad Request");
    next();
  }
};

export const withTransaction = async (handler) => {
  let transaction = null;
  try {
    transaction = await sequelize.transaction();
    const response = await handler(transaction);
    await transaction.commit();
    return response;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

export const fileToBase64 = async (file) => {
  try {
    const p = new Promise((resolve) => {
      fs.readFile(
        path.join(__dirname, `../${file.file}`),
        "base64",
        (err, data) => {
          if (err) throw err;
          resolve(data);
        }
      );
    });
    return await p;
  } catch (e) {
    return null;
  }
};

/**
 * This method receives a dirtyPath which can be just the file name
 * the filePath with '/' or without it. Either way, this will search
 * for the fileName and will return the entire path with /public/uploads as prefix
 */
const sanitizePath = (dirtyPath) => {
  const fileNameIndex = dirtyPath.lastIndexOf("/");
  const fileName = dirtyPath.substring(fileNameIndex || 0);
  return path.join(__dirname, "..", `/public/uploads/${fileName}`);
};

export const genericFileToBase64 = async (filePath) => {
  try {
    const p = new Promise((resolve) => {
      // Sanitize entry since we filePath changes based on the caller
      fs.readFile(sanitizePath(filePath), "base64", (err, data) => {
        if (err) throw err;
        resolve(data);
      });
    });
    return await p;
  } catch (e) {
    return null;
  }
};

export const clean = async (obj) => {
  for (var propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName];
    }
  }
  return obj;
};
