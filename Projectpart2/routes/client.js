module.exports = function(server) {
	server.get('/',function(req,res) {
		res.render('pages/index');
	});
	server.get('/:id',function(req,res) {
		res.render('pages/index');
	});
	server.get('/views/:view',function(req,res){
		res.render('views/'+req.params.view);
	});
};