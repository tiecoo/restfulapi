// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8080; // set our port

var mongoose   = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/beers'); // connect to our database
var Beer     = require('./app/models/beer');

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('A magica esta acontecendo');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'Bem vindo a api do sabatine' });
});

// on routes that end in /bears
// ----------------------------------------------------
router.route('/beers')

	// create a bear (accessed at POST http://localhost:8080/bears)
	.post(function(req, res) {

		var beer = new Beer();		// create a new instance of the Bear model
		beer.name = req.body.name;  // set the bears name (comes from the request)
		beer.price = req.body.price;
		beer.size = req.body.size;
		console.log(req.body);
		beer.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Beer created!' });
		});


	})

	// get all the bears (accessed at GET http://localhost:8080/api/bears)
	.get(function(req, res) {
		Beer.find(function(err, beers) {
			if (err)
				res.send(err);

			res.json(beers);
		});
	});

// on routes that end in /bears/:bear_id
// ----------------------------------------------------
router.route('/beers/:beer_id')

	// get the bear with that id
	.get(function(req, res) {
		Beer.findById(req.params.beer_id, function(err, beer) {
			if (err)
				res.send(err);
			console.log(beer);
			res.json(beer);
		});
	})

	// update the bear with this id
	.put(function(req, res) {
		Beer.findById(req.params.beer_id, function(err, bear) {

			if (err)
				res.send(err);

			beer.name = req.body.name;
			beer.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Beer updated!' });
			});

		});
	})

	// delete the bear with this id
	.delete(function(req, res) {
		Beer.remove({
			_id: req.params.beer_id
		}, function(err, beer) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('API do batine na porta ' + port);
