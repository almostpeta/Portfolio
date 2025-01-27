'use strict';

const userRoutes = require('./users');
const sessionRoutes = require('./sessions');
const cotizacionRoutes = require('./cotizaciones');
const me = require('./me');
const margenRoutes = require('./margenes');
const productoRoutes = require('./productos');

const register = server => {
  return server.route([
    ...me,
    ...userRoutes,
    ...sessionRoutes,
    ...cotizacionRoutes,
    ...margenRoutes,
    ...productoRoutes,
  ]);
};

module.exports = {
  register,
  name: 'routes',
};
