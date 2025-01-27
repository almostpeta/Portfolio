const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TransactionSchema = new Schema({
    date: { type: Date, required: true, default: Date.now },
    offerID: { type: String, required: true},
    publicationID: { type: String, required: true},
    userOf: { type: String, required: true},
    userPub: { type: String, required: true}
});


// Compile model from schema
module.exports = mongoose.model('Transaction', TransactionSchema );
