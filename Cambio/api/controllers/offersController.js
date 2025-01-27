const Offer = require('../models/offers');

// obtiene todas las ofertas
exports.getAllOffers = function (req, res) {
	Offer.find(
		function (err, offers) {
			if (err)
				res.send(err)
			res.json(offers); // devuelve todas las ofertas en JSON		
		}
	);
}
// Obtiene una oferta por su id
exports.getOfferById = function (req, res) {
	let param = req.params.id
	Offer.findOne(
		{ _id: param }, (err, offer) => {
			if (err)
				res.send(err)
			res.json(offer); // devuelve todas las ofertas en JSON		
		}
	);
}
// Obtiene las ofertas de un usuario
exports.getOffersByUser = function (req, res) {
	let param = req.params.email
	Offer.find({ user: param }, (err, ofertas) => {
		if (err)
			res.send(err)
		res.json(ofertas); // devuelve todas las ofertas en JSON		
	}
	);
}
// Obtiene todas las ofertas de una publicacion
exports.getAlloffersPublication = function (req, res) {
	let param = req.params.publication
	Offer.find({ publication: param }, (err, ofertas) => {

		if (err)
			res.send(err)
		res.json(ofertas); // devuelve todas las ofertas en JSON		
	}
	);
}

// crea una oferta
exports.setOffer = function (req, res) {
	console.log(req.body);
	Offer.create(
		{
			quantity: req.body.quantity,
			badge: req.body.badge,
			publication: req.body.publication,
			user: req.body.user
		},
		function (error, offer) {
			if (error)
				console.log(error)
				res.send(error);
			// Obtiene y devuelve todas las ofertas tras crear una de ellas
		/*	Offer.find(function (err, offer) {
				if (err)
					res.send(err)
				res.json(offer);
			});*/
		});

}

//actualiza isActive( si la oferta fue rechazada )
exports.updateIsActive = async function (req, res) {
	console.log(req.params.id)
	Offer.updateOne({ _id: req.params.id }, { isActive: false }, function (err, user) {
		if(err)
			res.send(err);
			Offer.findOne({ _id: req.params.id }, (err, use) => {
				console.log(use)
				if (err)
					res.send(err)
				res.json(use);
			}
			);
	})
}
//actualiza isAccepted( si la oferta es aceptada )
exports.updateIsAccepted = async function (req, res) {
	Offer.updateOne({ _id: req.params.id }, { isAccepted: true , isActive: false}, function (err, user) {
		if(err)
			res.send(err);
			Offer.findOne({ _id: req.params.id }, (err, use) => {
				console.log(use)
				if (err)
					res.send(err)
				res.json(use);
			}
			);
	})
}

exports.removeOffer = function (req, res) {
	console.log(req.params);
	Offer.deleteOne({ "_id": req.params.id }, function (err, user) {
		if (err)
			res.send(err);
		// Obtine y devuelve todas las ofertas tras borrar una de ellas
		Offer.find(function (err, use) {
			if (err)
				res.send(err)
			res.json("Deleted!");
		});
	});
}




