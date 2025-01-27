'use strict';

const Joi = require('@hapi/joi');

exports.create = {
  payload: Joi.object({
    costo: Joi.number().required(),
    codigo: Joi.string().required(),
    nombre: Joi.string().required(),
    articulo: Joi.string().required(),
    comentario: Joi.string().optional(),
    margenId: Joi.string().hex().required(),
    licenciaDeUsuario: Joi.boolean().optional(),
  }),
};

exports.get = {
  query: Joi.object({
    costo: Joi.number().optional(),
    codigo: Joi.string().optional(),
    nombre: Joi.string().optional(),
    articulo: Joi.string().optional(),
    comentario: Joi.string().optional(),
    margenId: Joi.string().hex().optional(),
  }),
};

exports.edit = {
  payload: Joi.object({
    id: Joi.string().required(),
    costo: Joi.number().optional(),
    codigo: Joi.string().optional(),
    nombre: Joi.string().optional(),
    articulo: Joi.string().optional(),
    comentario: Joi.string().optional(),
    margenId: Joi.string().hex().optional(),
    licenciaDeUsuario: Joi.boolean().optional(),
  }),
};

exports.find = {
  params: Joi.object({
    id: Joi.string().hex().required(),
  }),
};
