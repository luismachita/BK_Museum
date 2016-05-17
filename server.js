//================================
// Requirements
//================================
// load environment variable
require('dotenv').load();

// dependencies
var express = require('express');
	app = express(),
	port = process.env.PORT || 3000,
	bodyParser = require('body-parser'),
	request = require('request'),
	parseString= require('xml2js').parseString,
	brooklynKey = process.env.BROOKLYN_KEY,
//================================
// Middleware
//================================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static('public'));

// set app port
app.listen(port);

//================================
// Route 
//================================

// search collection
app.post('/Search', function(req,res){
	// we get the query from the client
	var query = req.body.query;	
	// we make the request
	request("http://www.brooklynmuseum.org/opencollection/api/?method=collection.search&version=1&api_key="+brooklynKey+"&keyword="+query,function(error, response, body) {
		var xml = response.body;
		// we parse the xml response :)
		parseString(xml, function(err, result){
			res.send(result);
		});
	});
});