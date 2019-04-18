/* librerie */
var express = require('express');
var fs = require('fs');
var path = require('path');
var mongo = require('mongodb').MongoClient;
var parser = require('body-parser');

/* variabili */
var app = express();
var database = "heroku_vbb83krx";
var url = "mongodb://" + database + ":kf65ur2nkaqqqcluvtrnv56lkf@ds135776.mlab.com:35776/" + database;

/* costanti */
const PORT = process.env.PORT || 5000;

/* raccolta dati in post */
app.use(parser.json());
app.use(parser.urlencoded({ extended : true })); 

/* path grafica */
app.use(express.static(path.join(__dirname, 'public')));

/* path pagine */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* REST */
app.get('/', (req, red) => red.render('pages/index'));

/* Aggiunta dei dati della tabella */
app.get('/document', function(req, red)
{
	mongo.connect(url, { useNewUrlParser: true }, function(err, db)
	{
		if (err) throw err;

		//console.log(path.join(__dirname, 'films/films.json'));

		var films = JSON.parse(fs.readFileSync(path.join(__dirname, 'films/films.json'), 'utf8'));
		var cur = db.db(database);

		cur.collection("films").insertMany(films, function(err, res)
		{
			if (err) throw err;

			//console.log("Collection inserted!");

			db.close();
		});
	});
	red.redirect('/');
});

/* Reset dei dati della tabella */
app.get('/truncate', function(req, red)
{
	mongo.connect(url, { useNewUrlParser: true }, function(err, db)
	{
		if (err) throw err;

		var cur = db.db(database);

		cur.collection("films").drop(function(err, res)
		{
			//console.log("Collection deleted!");

			db.close();
		});
	});
	red.redirect('/');
});

/* Redirect alla pagina di visualizzazione */
app.post('/visualize', function(req, red)
{
	var obj = req.body;
	var limit = parseInt(obj.limit);
	var year = parseInt(obj.year);

	//console.log("obj: " + JSON.stringify(obj));

	mongo.connect(url, { useNewUrlParser: true }, function(err, db)
	{
		if (err) throw err;

		var cur = db.db(database);

		if(obj.sub == "search")
		{
			//console.log("search");

			if(obj.title != "" && obj.year != "")
			{
				cur.collection("films").find({ title : {$regex: ".*" + obj.title + ".*"}, year : year }).limit(limit).toArray(function(err, res)
				{
					if (err) throw err;

					red.render('pages/visualize', { films : res });

					db.close();
				});
			}
			else if(obj.title != "")
			{
				cur.collection("films").find({ title : {$regex: ".*" + obj.title + ".*"} }).limit(limit).toArray(function(err, res)
				{
					if (err) throw err;

					red.render('pages/visualize', { films : res });

					db.close();
				});
			}
			else if(obj.year != "")
			{
				cur.collection("films").find({ year : year }).limit(limit).toArray(function(err, res)
				{
					if (err) throw err;

					red.render('pages/visualize', { films : res });

					db.close();
				});
			}
			else
			{
				red.redirect('/');
			}
		}
		else if(obj.sub == "visualize")
		{
			//console.log("visualize");

			cur.collection("films").find({}).limit(limit).toArray(function(err, res)
			{
				if (err) throw err;

				red.render('pages/visualize', { films : res });

				db.close();
			});
		}
		else
		{
			red.redirect('/');
		}
	});
});

/* ascolto sulla porta 5000 */
app.listen(PORT, () => console.log(`Listening on port: ${ PORT }`));