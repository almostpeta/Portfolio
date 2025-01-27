'use strict';

const Joi = require('@hapi/joi');


exports.create = {
  payload: Joi.object({
    nombre: Joi.string().required(),
    password: Joi.string().min(4).required(),
    type: Joi.string().required(),
  }),
};