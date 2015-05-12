var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config.json');

var server = express();
server.use(bodyParser.json());
server.set("views", __dirname + "/templates");
server.set("view engine","ejs");

server.use(express.static(__dirname + '/public_html'));

require('./routes/api')(server);
require('./routes/client')(server);

server.listen(config.port,function() {
	console.log("Server is listening on port: " + config.port);
});
