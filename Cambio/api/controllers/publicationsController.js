var Publications = require('../models/publications');

exports.getAllPublications = function (req, res){
	Publications.find(
		function(err, persona) {
			if (err)
				res.send(err)
					res.json(persona);	
				}
			);
}

exports.getAllPublicationsUser = function (req, res){
	let param = req.params.email
	Publications.find(
		{user: param}, (err, pub)=> {
			if (err)
				res.send(err)
					res.json(pub);	
				}
			);
}

exports.getPublicationById = function (req, res){
	let param = req.params.id
	Publications.findOne({_id: param}, (err, pub)=> {
		console.log(pub)
			if (err)
				res.send(err)
					res.json(pub); 	
				}
			);
}

exports.setPublicacion = async function(req, res) {
		Publications.create(
			{quantity : req.body.quantity,badge: req.body.badge, place: req.body.place, user: req.body.user}, 
			function(err, publications) {
				if (err)
					console.log(err);
					//res.send(err);
						res.json(publications)
						//console.log("Publications was created! "+ publications)
				// Obtine y devuelve todas las personas tras crear una de ellas
			/*	Publications.find(function(err, publications) {
				 	if (err)
				 		res.send(err)
				 	res.json(publications);
				});*/
			});

}
exports.updateIsActive = async function (req, res) {
	console.log(req.body)
	Publications.updateOne({ _id: req.params.id }, { isActive: false }, function (err, user) {
		if(err)
			res.send(err);
			Publications.findOne({ _id: req.params.id }, (err, use) => {
				console.log(use)
				if (err)
					res.send(err)
				res.json(use);
			}
			);
	})
}

exports.removePublication = function(req, res) {
	Publications.remove({_id : req.params.id}, function(err, persona) {
			if (err)
				res.send(err);
				// Obtine y devuelve todas las personas tras borrar una de ellas
				Publications.find(function(err, pub) {
					if (err)
						res.send(err)
					res.json("Deleted!");
				});
			});
		}