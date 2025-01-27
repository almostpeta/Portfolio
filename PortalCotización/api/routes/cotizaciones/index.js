/* jshint strict: true */

'use strict';

const config = require('./config');

module.exports = [
  {
    method: 'POST',
    path: '/cotizacion',
    config: config.create,
  },
  {
    method: 'GET',
    path: '/cotizacion',
    config: config.get,
  },
  {
    method: 'GET',
    path: '/cotizacion/{id}',
    config: config.find,
  },
  {
    method: 'PUT',
    path: '/cotizacion',
    config: config.edit,
  },
];
