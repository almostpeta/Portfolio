'use strict';

const Joi = require('@hapi/joi');

exports.create = {
  payload: Joi.object({
    nombre: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

exports.config = {
  query: Joi.object({
    token: Joi.string().required(),
  }),
};