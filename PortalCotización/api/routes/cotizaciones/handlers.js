'use strict';

const Boom = require('@hapi/boom');
const Cotizacion = require('../../models/Cotizacion');



exports.create = async (request, h) => {
  const { 
    cliente,
    comentario,
    creador,
    ultimaModificacion,
    fechaCreado,
    redundancia, 
    fechaEditado,
    carrito,
    margenes,
  } = request.payload;
  try {
    const cotizacion = await Cotizacion.create({ 
    cliente,
    comentario,
    creador,
    redundancia, 
    ultimaModificacion,
    fechaCreado,
    fechaEditado,
    carrito,
    margenes,
    });
    return h.response(cotizacion).code(201);
  } catch (err) {
    console.error(err);
    if (err.name === 'MongoError') {
      throw Boom.conflict('Error creating cotizacion');
    }
    throw err;
  }
};


exports.edit = async (request, h) => {
  const { 
    cliente,
    comentario,
    ultimaModificacion,
    fechaEditado,
    redundancia, 
    carrito,
    margenes
  } = request.payload;
  try {
    const cotizacion = await Cotizacion.findOneAndUpdate(
      { _id: request.payload.id },
      {cliente,
        comentario,
        ultimaModificacion,
        fechaEditado,
        redundancia, 
        carrito,
        margenes},
      { new: false },
    );
    return h.response(cotizacion).code(201);
  } catch (err) {
    if (err.name === 'MongoError') {
      throw Boom.conflict('Error creating cotizacion');
    }

    throw err;
  }
};

exports.find = async (request, h) => {
  try {
    const cotizaciones = await Cotizacion.find({_id: request.params.id});
    return h.response(cotizaciones).code(201);
  } catch (err) {
    if (err.name === 'MongoError') {
      throw Boom.conflict('Error getting cotizaciones');
    }
    throw err;
  }
};

exports.get = async (request, h) => {
  try {
    const cotizaciones = await Cotizacion.find(request.query);
    return h.response(cotizaciones).code(201);
  } catch (err) {
    if (err.name === 'MongoError') {
      throw Boom.conflict('Error getting cotizaciones');
    }
    throw err;
  }
};