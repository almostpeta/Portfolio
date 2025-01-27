'use strict';

const Boom = require('@hapi/boom');

const User = require('../../models/User');

exports.create = async (request, h) => {
  const {
    nombre,
    password,
    type,
  } = request.payload;

  try {
    const user = await User.create({
      nombre,
      password,
      type, 
    });
    return h.response(user).code(201);
  } catch (err) {
    console.error(err);
    if (err.name === 'MongoError' && err.code === 11000) {
      throw Boom.conflict('user already exists');
    }
    throw err;
  }
};