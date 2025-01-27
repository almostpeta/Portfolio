'use strict';

const mongoose = require('mongoose');

const margenSchema = new mongoose.Schema({
  descripcion: { type: String, required: true },
  margenEstandar: { type: Number, required: true },
}, { collection: 'margenes' });

const Margen = mongoose.model('Margen', margenSchema);

module.exports = Margen;
