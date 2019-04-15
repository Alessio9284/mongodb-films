var express = require('express');
var app = express();
var path = require('path');
var PORT = process.env.PORT || 5000
var mongo = require('mongodb').MongoClient;
/*var url = "mongodb://localhost:" + PORT + "/";*/

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('pages/index'));

/* Aggiunta dei dati della tabella */
app.get('/document', function(req, res)
{/*
	mongo.connect(url, function(err, db)
	{
		if (err) throw err;
		var cursor = db.db("mongodb-films");
		var films = { name: "Company Inc", address: "Highway 37" };
		cursor.collection("films").insertMany(myobj, function(err, res)
		{
			if (err) throw err;
			console.log("1 document inserted");
			db.close();
		});
	});*/
	res.render('pages/index');
});

/* Reset dei dati della tabella */
app.get('/truncate', function(req, res)
{
	/*
	mongo.connect(url, function(err, db)
	{
		if (err) throw err;
		var cursor = db.db("mongodb-films");
		var films = { name: "Company Inc", address: "Highway 37" };
		cursor.collection("films").insertMany(myobj, function(err, res)
		{
			if (err) throw err;
			console.log("1 document inserted");
			db.close();
		});
	});*/
	res.render('pages/index');
});

app.listen(PORT, () => console.log(`Listening on PORT: ${ PORT }`));
/*
mongo.connect(url, function(err, db)
{
	if (err) throw err;
	var cursor = db.db("mongodb-films");
	var myobj = { name: "Company Inc", address: "Highway 37" };
	cursor.collection("films").insertMany(myobj, function(err, res)
	{
		if (err) throw err;
		console.log("1 document inserted");
		db.close();
	});
});*/