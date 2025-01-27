const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BadgeSchema = new Schema({
    name: { type: String, required: true},
    code: { type: String, required: true}
});

module.exports = mongoose.model('Badge', BadgeSchema );