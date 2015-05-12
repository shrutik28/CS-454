var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config.json');

var app = express();
app.use(bodyParser.json());
app.set("views", __dirname + "/templates");
app.set("view engine","ejs");

app.use(express.static(__dirname + '/public'));

require('./routes/api')(app);
require('./routes/client')(app);

app.listen(8000,function() {
	console.log("Server  is listening.... " );
});
