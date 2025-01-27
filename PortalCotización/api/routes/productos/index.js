'use strict';

const config = require('./config');

module.exports = [
  {
    method: 'POST',
    path: '/productos',
    config: config.create,
  },
  {
    method: 'GET',
    path: '/productos',
    config: config.get,
  },
  {
    method: 'PUT',
    path: '/productos',
    config: config.edit,
  },
  {
    method: 'GET',
    path: '/productos/{id}',
    config: config.find,
  },
  {
    method: 'DELETE',
    path: '/productos/{id}',
    config: config.delete,
  },
];
