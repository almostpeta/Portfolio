'use strict';

const mongoose = require('mongoose');
const autoIncrementModelID = require('./counterModel');

const cotizacionSchema = new mongoose.Schema({
  codigo: { type: Number, min: 1 },
  cliente: { type: String, required: true},
  comentario: { type: String, required: true},
  creador: { type: String, required: true},
  ultimaModificacion: { type: String, required: true},
  redundancia: {type: Boolean},
  fechaCreado: {type: Date, default: Date.now },
  fechaEditado: {type: Date, default: Date.now },
  carrito: [{producto: {type: mongoose.Schema.Types.ObjectId, ref: 'producto' }, cantidad: {type: Number, required:true}}],
  margenes: [{margen: {type: mongoose.Schema.Types.ObjectId, ref: 'margen' }, cantidad: {type: Number, required:true}}],
}, {collection: 'cotizaciones'});

cotizacionSchema.pre('save', function (next) {
  if (!this.isNew) {
    next();
    return;
  }
  autoIncrementModelID('activities', this, next);
});

const Cotizacion = mongoose.model('Cotizacion', cotizacionSchema);

module.exports = Cotizacion;
