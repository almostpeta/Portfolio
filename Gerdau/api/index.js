/* jshint strict: true */
"use strict";
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { start } = require("./server");

process.on("unhandledRejection", (err) => {
  console.log(err); // eslint-disable-line no-console
  process.exit(1);
});

start();
