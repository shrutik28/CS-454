module.exports = function(server) {
	server.get('/',function(req,res) {
		res.render('pages/index');
	});
};