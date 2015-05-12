var config = require("../config.json");
var Api = config.api.comicvine;
var superagent = require('superagent');

module.exports = function(server) {
	server.get('/api/search',function(req,res) {
		var time = (new Date()).getTime();
		superagent
			.get(Api.request_url+"/characters")
			.query({"api_key":Api.api_key})
			.query({"filter":"name:"+req.query.name})
			.query({"limit":20})
			.query({"format":"json"})
			.end(function(error,result) {
				if(result && result.body) {
					res.json({
						success: result.body.error == "OK",
						message: result.body.error,
						results: result.body.results
					});
				} else {
					res.json({
						success: true,
						message: "",
						results: []
					});
				}
			});
	});
};