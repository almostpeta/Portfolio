var ControllerPub = require ('../controllers/publicationsController');
var ControllerBadge = require ('../controllers/badgeController');
var offerController = require ('../controllers/offersController');
var transactionController = require ('../controllers/transactionController');
var userController = require('../controllers/usersController');
var brouController = require('../controllers/brouController')

module.exports = function(app) {

	/** ########## PUBLICACIONES ################################################## */
	// devolver todas las publicaciones
    app.get('/api/publication', ControllerPub.getAllPublications);
    // devolver una publicacion por id
	app.get('/api/publication/:id', ControllerPub.getPublicationById);
	//Devolver las publicaciones de un usuario
	app.get('/api/publicationUser/:email', ControllerPub.getAllPublicationsUser);
	// Crear una nueva publicacion
	app.post('/api/publication', ControllerPub.setPublicacion);
	// Actualiza si la publicacion fue finalizada
	app.put('/api/publication/:id', ControllerPub.updateIsActive);
	// Eliminar los datos de una Persona
	app.delete('/api/publication/:id', ControllerPub.removePublication);

	/** ########## DIVISAS ################################################## */
	//Obtiene todas las divisas
	app.get('/api/badge', ControllerBadge.getAllBadge);
	//Creo una divisa
	app.post('/api/badge', ControllerBadge.setPublicacion);

	/** ########## OFERTAS ################################################## */
	//obtener todas las ofertas
	app.get('/api/offer', offerController.getAllOffers);
	// obetener una oferta por id
	app.get('/api/offer/:id', offerController.getOfferById);
	//obetner todas las ofertas de una publicacion
	app.get('/api/offer/publication/:publication', offerController.getAlloffersPublication);
	//obtener todas las ofertas de un usuario
	app.get('/api/offer/user/:email', offerController.getOffersByUser);
	//crear oferta
	app.post('/api/offer', offerController.setOffer);
	//actualiza si la oferta fue finalizada
	app.put('/api/offer/:id', offerController.updateIsActive);
	//actualiza si la oferta fue aceptada
	app.put('/api/offer/accepted/:id', offerController.updateIsAccepted);
	// eliminar oferta por su id
	app.delete('/api/offer/:id', offerController.removeOffer);

	/** ########## TRANSACCIONES ################################################## */
	app.get('/api/transaction', transactionController.getAllTransaction);
    
	app.get('/api/transaction/:id', transactionController.getTransactionById);
	
	app.get('/api/offerTransaction/:OfferId', transactionController.getAllTransactionOffer);
    
	app.get('/api/userTransaction/:userId', transactionController.getTransactionUser);
	
	app.post('/api/transaction', transactionController.setTransaction);
	
	app.delete('/api/transaction/:id', transactionController.removeTransaction);

	
	/** ########## USUARIOS ################################################## */
	app.get('/api/user', userController.getAllUser);
    // Obtiene un usuario por email
	app.get('/api/user/:id', userController.getUserById);
	// Agrega un usuario
	app.post('/api/user', userController.setUser);
	// Actualiza score de un usuario
	app.put('/api/user/:email', userController.updateScoreUser);
	// Eliminar usuario por email
	app.delete('/api/user/:id', userController.removeUser);
	// Login 
	app.post('/api/login', userController.loginUser);

	// Enviar email
	app.post('/api/sendEmail', userController.sendMail);



	/**############### COTIZACIONES ########################################### */

	app.post('/api/brou', brouController.getDiff);

	app.get('*', function(req, res) {
		res.sendfile('./angular/index.html'); // Carga única de la vista
	});
};