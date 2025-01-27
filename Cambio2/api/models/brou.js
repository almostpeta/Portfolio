var Cotizacion = {
    inputCoin: { type: String, required: true},
    outputCoin: { type: String, required: true},
    inputQuantity: {type: Number, require: true},
    outputQuantity: {type: Number, require: true}
};

var Response = {
    saving: {type: Number}
}

module.exports = Cotizacion;