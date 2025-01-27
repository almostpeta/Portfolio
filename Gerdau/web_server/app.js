const express = require("express");
const path = require("path");
const app = express();

const root = path.join(__dirname, 'build');

app.use(express.static(root));

app.get('*', function (req, res) {
  res.sendFile('index.html', {root});
});

module.exports = app;