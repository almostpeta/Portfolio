'use strict';

const config = require('./config');

module.exports = [
  {
    method: 'POST',
    path: '/margen',
    config: config.create,
  },
  {
    method: 'GET',
    path: '/margen',
    config: config.get,
  },
  {
    method: 'DELETE',
    path: '/margen/{id}',
    config: config.delete,
  },
  {
    method: 'PUT',
    path: '/margen',
    config: config.edit,
  },
];
