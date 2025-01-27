'use strict';

const handlers = require('./handlers');
const validations = require('./validations');

exports.create = {
  handler: handlers.create,
  validate: validations.create,
  description: 'Create cotizacion',
};

exports.get = {
  handler: handlers.get,
  validate: validations.get,
  description: 'List cotizacion',
};

exports.find = {
  handler: handlers.find,
  description: 'Find cotizacion by id',
};

exports.edit = {
  handler: handlers.edit,
  validate: validations.edit,
  description: 'Edit cotizacion',
};

