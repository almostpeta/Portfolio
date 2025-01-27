const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const offerSchema = new Schema({
    date: { type: Date, default: Date.now },
    quantity: { type: Number, required: true },
    badge: { type: String, required: true },    // (id de divisa)
    publication: { type: String, required: true },    // (id de publicacion)
    user: { type: String, required: true },      // (email del usuario)
    isAccepted: {type: Boolean, require: true, default: false},
    isActive: {type: Boolean, required: true, default: true}
    
});

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;
