const express = require('express');
const app = express();
const fs = require('fs');

const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var health = "unhealthy";
fs.writeFileSync("health.txt", health);

app.get('/', (req, res) => {
	if(health != "healthy") {
		res.status(500);
		res.send("not healthy: " + health);
	} else {
		res.send('Hello World!');
	}
});

app.get('/health', (req, res) => {
	var body = {};
	body.health = health;
	res.json(body);
});

app.put('/health', jsonParser, (req, res) => {
	var body = {};
	if (req.body.health.match("healthy|unhealthy|reserved")) {
		fs.writeFile("health.txt", req.body.health, (err) => {
		   if(err) {
		      body.message = "file write error";
		      body.error = err;
		      res.status(500);
	              res.json(body);
		   } else {
		      console.log('Setting health: ' + req.body.health);
		      health = req.body.health;
		      body.message = "health is now: " + req.body.health;
	              res.json(body);
		   }
		});
	} else {
		res.status(400);
		body.message = "Unknown health value, use 'healthy', 'unhealthy', or 'reserved': " + req.body.health;
	        res.json(body);
	}
});

app.listen(8080, () => console.log('Example app listening on port 8080!'));

