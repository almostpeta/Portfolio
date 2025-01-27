'use strict';

const handlers = require('./handlers');
const validations = require('./validations');

exports.create = {
  handler: handlers.create,
  validate: validations.create,
  description: 'Create margen',
};

exports.get = {
  handler: handlers.get,
  description: 'List margen',
};

exports.delete = {
  handler: handlers.delete,
  description: 'Delete margen',
};

exports.edit = {
  handler: handlers.edit,
  description: 'Edit margen',
};
