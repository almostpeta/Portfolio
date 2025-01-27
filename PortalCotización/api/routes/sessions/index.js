'use strict';

const config = require('./config');

module.exports = [
  {
    method: 'POST',
    path: '/sessions',
    config: config.create,
  },
  {
    method: 'GET',
    path: '/sessions',
    config: config.verify,
  },
];
