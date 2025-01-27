var Transaction = require('../models/transaction');

// obtiene todas las transacciones
exports.getAllTransaction = function (req, res){
	Transaction.find(
		function(err, transaction) {
			if (err)
				res.send(err)
					res.json(transaction);	
				}
			);
}

exports.getAllTransactionOffer = function (req, res){
	let param = req.params.Offerid
	Transaction.find(
		{offerID: param}, (err, pub)=> {
			if (err)
				res.send(err)
					res.json(pub);	
				}
			);
}


exports.getTransactionById = function (req, res){
	let param = req.params.id
	Transaction.find({_id: param}, (err, pub)=> {
		console.log(pub)
			if (err)
				res.send(err)
					res.json(pub); 	
				}
			);
}

exports.getTransactionUser = async function (req, res){
	let param = req.params.userId
	console.log(param)
	try {
		let result1 = await Transaction.find({userOf: param}, (err, pub)=> {
			console.log(pub)
				if (err)
						return pub	
					}
				);
		let result2 = await Transaction.find({userPub: param, userPub: param}, (err, pub)=> {
			console.log(pub)
				if (err)
						return pub; 	
					}
				);
		res.json(result1.concat(result2))
	} catch (error) {
			res.send(error)
	}
}


exports.setTransaction = function(req, res) {
    Transaction.create(
			{offerID : req.body.offerID, publicationID: req.body.publicationID, userOf: req.body.userOf, userPub: req.body.userPub  }, 
			function(err, transaccion) {
				if (err)
					res.send(err);
				// Obtine y devuelve todas las personas tras crear una de ellas
				Transaction.find(function(err, transaccion) {
				 	if (err)
				 		res.send(err)
				 	res.json(transaccion);
				});
			});
	}

exports.removeTransaction = function(req, res) {
	Transaction.remove({_id : req.params.id}, function(err, persona) {
			if (err)
				res.send(err);
				// Obtine y devuelve todas las personas tras borrar una de ellas
				Transaction.find(function(err, tra) {
					if (err)
						res.send(err)
					res.json("Deleted!");
				});
			});
		}