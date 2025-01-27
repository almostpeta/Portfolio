'use strict';

const Boom = require('@hapi/boom');

const User = require('../../models/User');
const { createAccessToken, verifyAccessToken, decodeAccessToken } = require('../../utils/tokens');

const unauthorizedError = Boom.unauthorized('Invalid nombre/password combination');

exports.create = async (request, h) => {
  const { nombre, password } = request.payload;

  const user = await User.findOne({ nombre });
  if (!user) {
    throw unauthorizedError;
  }

  const passwordMatches = await user.comparePassword(password);
  if (!passwordMatches) {
    throw unauthorizedError;
  }
 
  const token = createAccessToken(user.id);
  const response = { token: token, type: user.type};
  return h.response(response).code(201);
};

exports.verify = async (request, h) => {
  let token = request.query.token;
  try{
    let userid = verifyAccessToken(token).sub;
    const user = await User.findOne({_id: userid });
    return h.response(user).code(201);
  }catch(err){
    if (err.name === 'JsonWebTokenError') {
      throw Boom.conflict('invalid token');
    }
    throw err;
  }
};