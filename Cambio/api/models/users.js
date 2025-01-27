const mongoose = require('mongoose');
var autoIncrement = require("mongodb-autoincrement");

var Schema = mongoose.Schema;

var UserSchema = new Schema({

    email: { type: String, required: true, trim: true,
        unique: true },
    password: { type: String, required: true, trim: true },
    name: { type: String, trim: true},
    phone: { type: String, trim: true},
    score: { type: Number, required: true, default: 0, trim: true},
    lscore: [{ type: Number, required: true, default: []}]

});


// Compile model from schema
module.exports = mongoose.model('User', UserSchema);