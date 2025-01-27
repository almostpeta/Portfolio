'use strict';

const Boom = require('@hapi/boom');

const Margen = require('../../models/Margen');
const Producto = require('../../models/Producto');

exports.create = async (request, h) => {
  const { 
    descripcion,
    margenEstandar,
  } = request.payload;
  try {
    const margen = await Margen.create({
      descripcion,
      margenEstandar,
    });
    return h.response(margen).code(201);
  } catch (err) {
    if (err.name === 'MongoError') {
      throw Boom.conflict('Error creating margen');
    }

    throw err;
  }
};

exports.get = async (request, h) => {
  try {
    const margen = await Margen.find(request.query);
    return h.response(margen).code(201);
  } catch (err) {
    if (err.name === 'MongoError') {
      throw Boom.conflict('Error getting margen');
    }
    throw err;
  }
};


exports.delete = async (request, h) => {
  try {
    const productos = await Producto.find({margenId:request.params.id});
    if(productos.length === 0){
      await Margen.deleteOne({
        _id: request.params.id,
      });
      return h.response('Deleted').code(201);
    }
    else{
      throw Boom.conflict('Error deleting margen');
    }
    
  } catch (err) {
    if (err.name === 'MongoError') {
      throw Boom.conflict('Error deleting margen');
    }
    throw err;
  }
};

exports.edit = async (request, h) => {
  const {
    descripcion,
    margenEstandar,
  } = request.payload;
  try {
    const margen = await Margen.updateOne(
      { _id: request.payload.id },
      {
        descripcion,
        margenEstandar, 
      },
    );
    return h.response(margen).code(201);
  } catch (err) {
    if (err.name === 'MongoError') {
      throw Boom.conflict('Error updating margen');
    }
    throw err;
  }
};
