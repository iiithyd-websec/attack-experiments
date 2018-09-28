
var express = require('express');
var server = express();
server.set('view engine', 'ejs');
//Optional, since expressjs looks into 'views' by default.
server.set('views', __dirname + '/views'); 

// middleware
server.use(express.favicon(__dirname + '/public/img/favicon.ico'));
server.use(express.static(__dirname+'/public'));
server.configure('production', function () {
    server.disable('view cache');
});
server.configure('development', function () {
    server.disable('view cache');
});
server.get('/', function(req, res){
  res.redirect('home');
});
server.get('/home', function(req, res){
  res.render('home');
});
server.get('/csrf',  function (req, res) {
    res.render('csrf');
});
server.get('/clickjacking',  function (req, res) {
    res.render('clickjacking');
});
server.get('/timing',  function (req, res) {
    res.render('timing');
});
server.use(function(req, res, next){
  res.status(404);
  res.render('404', {url:req.url});
});
var port = process.env.PORT || 3200;
server.listen(port, function() {
  console.log("Listening on " + port);
});
