/* librerie */
var express = require('express');
var fs = require('fs');
var path = require('path');
var mongo = require('mongodb').MongoClient;

/* variabili */
var app = express();
var database = "heroku_vbb83krx";
var url = "mongodb://" + database + ":kf65ur2nkaqqqcluvtrnv56lkf@ds135776.mlab.com:35776/" + database;

/* costanti */
const PORT = process.env.PORT || 5000;

/* path grafica */
app.use(express.static(path.join(__dirname, 'public')));

/* path pagine */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* REST */
app.get('/', (req, res) => res.render('pages/index'));

/* Aggiunta dei dati della tabella */
app.get('/document', function(req, res)
{
	mongo.connect(url, { useNewUrlParser: true }, function(err, db)
	{
		if (err) throw err;

		//console.log(path.join(__dirname, 'films/films.json'));

		var films = JSON.parse(fs.readFileSync(path.join(__dirname, 'films/films.json'), 'utf8'));
		var cursor = db.db(database);

		cursor.collection("films").insertMany(films, function(err, res)
		{
			if (err) throw err;
			console.log("film inseriti nel documento");
			db.close();
		});

		db.close();
	});
	res.redirect('/');
});

/* Reset dei dati della tabella */
app.get('/truncate', function(req, res)
{
	mongo.connect(url, { useNewUrlParser: true }, function(err, db)
	{
		if (err) throw err;

		var cursor = db.db(database);

		cursor.collection("films").drop(function(err, res)
		{
			if (err) throw err;

			if (res)
			{
				console.log("Collection deleted");
			}
			else
			{
				console.log("Collection not deleted");
			}
		});

		db.close();
	});
	res.redirect('/');
});

/* ascolto sulla porta 5000 */
app.listen(PORT, () => console.log(`Listening on PORT: ${ PORT }`));

/* connessione al database */
mongo.connect(url, { useNewUrlParser: true }, function(err, db)
{
	if (err) throw err;
	/*var cursor = db.db(database);
	var myobj = { name: "Company Inc", address: "Highway 37" };
	cursor.collection("films").insertMany(myobj, function(err, res)
	{
		if (err) throw err;
		console.log("1 document inserted");
		db.close();
	});*/
	//console.log("un documento inserito");
	db.close();
});