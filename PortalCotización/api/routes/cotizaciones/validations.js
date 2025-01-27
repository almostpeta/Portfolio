'use strict';

const Joi = require('@hapi/joi');

exports.create = {
  payload: Joi.object({
    cliente: Joi.string().required(),
    comentario:Joi.string().required(),
    creador:Joi.string().required(),
    ultimaModificacion:Joi.string().required(),
    fechaCreado:Joi.date().required(),
    redundancia:Joi.boolean().required(),
    fechaEditado:Joi.date().required(),
    carrito:Joi.array().required(),
    margenes:Joi.array().required(),
  }),
};

exports.edit = {
  payload: Joi.object({
    id: Joi.string().required(),
    cliente: Joi.string().required(),
    comentario:Joi.string().required(),
    ultimaModificacion:Joi.string().required(),
    redundancia:Joi.boolean().required(),
    fechaEditado:Joi.date().required(),
    carrito:Joi.array().required(),
    margenes:Joi.array().required(),
  }),
};

exports.get = {
  query: Joi.object({
    cliente: Joi.string().optional(),
    comentario:Joi.string().optional(),
    creador:Joi.string().optional(),
    ultimaModificacion:Joi.string().optional(),
    redundancia:Joi.boolean().optional(),
    fechaCreado:Joi.date().optional(),
    fechaEditado:Joi.date().optional(),
    carrito:Joi.array().optional(),
    margenes:Joi.array().optional(),
  }),
};