'use strict';

const Boom = require('@hapi/boom');

const Producto = require('../../models/Producto');

exports.create = async (request, h) => {
  const {
    costo,
    nombre,
    codigo,
    comentario,
    licenciaDeUsuario,
    margenId,
    articulo,
  } = request.payload;
  try {
    const producto = await Producto.create({
      costo,
      nombre,
      codigo,
      articulo,
      licenciaDeUsuario,
      comentario,
      margenId,
    });
    return h.response(producto).code(201);
  } catch (err) {
    if (err.name === 'MongoError') {
      throw Boom.conflict('Error creating producto');
    }
    throw err;
  }
};

exports.get = async (request, h) => {
  try {
    const productos = await Producto.find(request.query);
    return h.response(productos).code(201);
  } catch (err) {
    console.error(err);
    if (err.name === 'MongoError') {
      throw Boom.conflict('Error getting productos');
    }
    throw err;
  }
};

exports.edit = async (request, h) => {
  try {
    const {
      _id,
      costo,
      codigo,
      nombre,
      comentario,
      licenciaDeUsuario,
      margenId,
      articulo,
    } = request.payload;
    const productos = await Producto.updateOne(
      { _id },
      {
        costo,
        codigo,
        nombre,
        licenciaDeUsuario,
        comentario,
        articulo,
        margenId,
      },
    );
    return h.response(productos).code(201);
  } catch (err) {
    if (err.name === 'MongoError') {
      throw Boom.conflict('Error updating producto');
    }
    throw err;
  }
};

exports.find = async (request, h) => {
  try {
    const producto = await Producto.find({ _id: request.params.id });
    return h.response(producto).code(201);
  } catch (err) {
    if (err.name === 'MongoError') {
      throw Boom.conflict('Error getting producto');
    }
    throw err;
  }
};

exports.delete = async (request, h) => {
  try {
    await Producto.deleteOne({
      _id: request.params.id,
    });
    return h.response('Deleted').code(201);
  } catch (err) {
    if (err.name === 'MongoError') {
      throw Boom.conflict('Error deleting producto');
    }
    throw err;
  }
};
