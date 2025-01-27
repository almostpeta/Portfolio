'use strict';

const Joi = require('@hapi/joi');

exports.create = {
  payload: Joi.object({
    descripcion: Joi.string().required(),
    margenEstandar: Joi.number().required(),
  }),
};

exports.get = {
  query: Joi.object({
    descripcion: Joi.string().optional(),
    margenEstandar: Joi.number().optional(),
  }),
};


exports.delete = {
  params: Joi.object({
    id: Joi.string()
      .hex()
      .required(),
  }),
};

exports.edit = {
  payload: Joi.object({
    id: Joi.string().required(),
    descripcion: Joi.string().optional(),
    margenEstandar: Joi.number().optional(),
  }),
};
