const fetch = require('node-fetch')
let Cotizaciones = require('../models/brou')
let endpoint = 'https://cotizaciones-brou.herokuapp.com/api/currency/latest'

async function gerResourceAsync() {
    var json;
    let resource = await fetch(endpoint, {
      method: "GET"
    }).then(res =>{
        return res.json()});
    return resource;
}

exports.getDiff = async function(req, res){
    cotizacion = req.body;
    console.log(cotizacion)
    let actualChange = await gerResourceAsync();
    console.log(actualChange)
    if(cotizacion.inputCoin == 'UYU'){
        const price = actualChange.rates[cotizacion.outputCoin].sell;
        let totalPrice = cotizacion.inputQuantity * price;
        console.log("total price:"+ totalPrice);
        let diff =   cotizacion.outputQuantity - totalPrice;
        return res.json({diff : diff});
    }else{
        const actualUYprice = actualChange.rates[cotizacion.inputCoin].buy
        let totalPrice = cotizacion.inputQuantity * actualUYprice;
        let diff =   cotizacion.outputQuantity - totalPrice;
        return res.json({diff : diff});
    }

}