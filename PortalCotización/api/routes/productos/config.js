'use strict';

const handlers = require('./handlers');
const validations = require('./validations');

exports.create = {
  handler: handlers.create,
  validate: validations.create,
  description: 'Create producto',
};

exports.get = {
  handler: handlers.get,
  description: 'List producto',
};

exports.find = {
  handler: handlers.find,
  description: 'Find producto',
};

exports.edit = {
  handler: handlers.edit,
  description: 'Edit producto',
};

exports.delete = {
  handler: handlers.delete,
  description: 'Delete producto',
};
