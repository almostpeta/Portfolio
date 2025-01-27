var Badge = require('../models/badge');

exports.getAllBadge = function (req, res){
	Badge.find(
		function(err, badge) {
			if (err)
				res.send(err)
					res.json(badge);	
				}
			);
}

exports.setPublicacion = function(req, res) {
        Badge.create(
			{name : req.body.name, code: req.body.code}, 
			function(err, badge) {
				if (err)
					res.send(err);
				Badge.find(function(err, badge) {
				 	if (err)
				 		res.send(err)
				 	res.json(badge);
				});
			});

	}