'use strict';

const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  costo: { type: Number, required: true },
  codigo: { type: String, required: true },
  nombre: { type: String, required: true },
  articulo: { type: String, required: true },
  comentario: { type: String, required: true },
  licenciaDeUsuario: {type: Boolean, required:false},
  margenId: { type: mongoose.Schema.Types.ObjectId, ref: 'margen' }
});

const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;
