const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PublicationSchema = new Schema({
    date: { type: Date, default: Date.now },
    quantity: { type: String, required: true },
    badge: { type: String, required: true },
    place: { type: String, required: true },
    user: { type: String, required: true },
    isActive: {type: Boolean, required: true, default: true}
});

module.exports = mongoose.model('Publication', PublicationSchema );