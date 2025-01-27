'use strict';

const handlers = require('./handlers');

exports.get = {
  auth: 'jwt',
  handler: handlers.get,
  description: 'Verify token',
};
