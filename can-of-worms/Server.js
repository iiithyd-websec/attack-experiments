
var express = require('express');
var server = express();
server.set('view engine', 'ejs');
//Optional, since expressjs looks into 'views' by default.
server.set('views', __dirname + '/views'); 

// middleware
server.use(express.favicon(__dirname + '/public/img/favicon.ico'));
server.use(express.static(__dirname+'/public'));
server.use(express.bodyParser());
server.use(express.cookieParser('shhhh, very secret'));
server.use(express.session());
var host="";

server.configure('production', function () {
    server.disable('view cache');
        host="http://hidden-brushlands-4145.herokuapp.com";
});
server.configure('development', function () {
    server.disable('view cache');
        host="http://localhost:3100";
});
// Session-persisted message middleware
server.use(function (req, res, next) {
    var fullname=req.session.user? req.session.user.fullname : "";
    res.locals.loggedInUser = fullname; //used in navbar
    res.locals.usersList=usersList; //used in transfer.js., needs cleaning.
    next();
});
//Dummy database
var usersDB = {
    admin: {username: 'admin', pwd: 'admin', fullname: 'Awesome Admin', balance: 5000, active: true},
    alice: { username: 'alice', pwd: 'alice', fullname:'Amazing Alice', balance: 2000, active: true },
    bob: { username:'bob', pwd: 'bob', fullname:'Brilliant Bob', balance: 500, active: true},
    mallory: { username:'mallory', pwd: 'mallory', fullname: 'Malicious mallory', balance: 0, active: true}
};
var setCORP = function (req, res, next) {
  console.log("Adding CORP to response header on the page: " + req.url);
  /* Note: CORP is a global policy set on the login/home page. It is not meant to be a per-page policy like CSP. 
          Irrespective of what page the user is in, an attacker can always trigger a cross origin request.
          So the policy should always work. */ 
    // var policy = "image-src http://hidden-brushlands-4145.herokuapp.com/img/;frame-descendants DENY;default-src DENY";

  var policy = "image-src http://localhost:3100/img/;frame-descendants DENY;default-src DENY";
  res.header('CORP', policy);
  next();
}
var usersList=[];
for(var user in usersDB){
    if(usersDB.hasOwnProperty(user)) {
        usersList.push({'username': usersDB[user].username, 'fullname':usersDB[user].fullname});
    }
}
// Authenticate using our plain-object database!
function authenticate(name, pass, fn) {

  //if (!module.parent) console.log('authenticating %s:%s', name, pass);
  var user = usersDB[name];

  // query the db for the given username
  if (!user) return fn(new Error('Cannot find user!'));
  
  if (user.active === true && pass === user.pwd) return fn(null, user);
  fn(new Error('invalid password'));
}
function restrict(req, res, next) {
  if (req.session.user) {
        //console.log('req.session.user: ', req.session.user);
    next();
  } else {
        res.status(404);
        var msg='<p class="alert alert-error">Access denied!</p>';
        res.render('login', {usersDB: usersDB, msg: msg});
  }
}
server.get('/', function(req, res){
  res.redirect('login');
});
server.get('/settings', restrict, function (req, res) {
    res.render('settings');
    // res.send('Hello, '+req.session.user.fullname+'! This is your profile page.');
});
server.get('/changePassword', restrict, function (req, res){
        var current=new Date();
        var timeStamp = current.getHours()+':'+current.getMinutes()+':'+current.getSeconds()
    //console.log('New pwd: ', req.query.new, ' :: Timestamp: ', timeStamp);
    if(req.query.new){
        var currentUser=req.session.user;
        usersDB[currentUser.username].pwd=req.query.new;
        //res.redirect('/logout');
                req.session.destroy(function(){
                        res.redirect('/');
        });
    }
});
server.get('/resetBalance', restrict, function(req, res){
    usersDB['admin'].balance=5000;
    usersDB['alice'].balance=2000; 
    usersDB['bob'].balance=500;
    usersDB['mallory'].balance=0;
    res.redirect('logout');
});
server.get('/logout', function(req, res){
  // destroy the user's session to log them out
  // will be re-created next request
  req.session.destroy(function(){
    res.redirect('/');
  });
});
server.get('/login', setCORP, function(req, res){
  res.render('login', {usersDB: usersDB, msg: ''});
});
server.get('/home', restrict, function (req, res) {
    res.render('home');
});
server.post('/home', function (req, res) {
    authenticate(req.body.username, req.body.password, function (err, user) {
        if (user) {
            // Regenerate session when signing in
            // to prevent fixation 
            req.session.regenerate(function () {
                // Store the user's primary key 
                // in the session store to be retrieved,
                // or in this case the entire user object
                req.session.user = user;
                res.redirect('home');
            });
        } else {
                        res.status(401);
                        var msg='<p class="alert alert-error">Authentication failed!</p>';
                        res.render('login', {usersDB: usersDB, msg: msg});
        }
    });
});
server.get('/deactivateAccount', restrict, function(req, res){
    var currentUser=req.session.user;
    if (currentUser.username !== 'admin'){
        usersDB[currentUser.username].active=false;
    }
    res.redirect('logout');
});
server.get('/activateAccount', restrict, function(req, res){
    for(var user in usersDB){
        if(usersDB.hasOwnProperty(user)){
            usersDB[user].active=true;
         }
    }
    res.redirect('settings');
});
server.get('/transfer', restrict, function(req, res){
    res.render('transfer', {balance: req.session.user.balance, msg: ''});
});

server.post('/transfer', function(req, res){
    var transferTo=req.body.transferTo;
    var amount=req.body.amount;
    var currentUser=req.session.user;
        var msg='';
    if(Number(currentUser.balance) >= Number(amount)){
        //Deduct amount from current user and update DB.
        usersDB[currentUser.username].balance=Number(currentUser.balance) - Number(amount);
        //Add the amount to the beneficiary and update DB.
        usersDB[transferTo].balance = Number(usersDB[transferTo].balance) + Number(amount);
        req.session.user=usersDB[currentUser.username];
    } else{
        msg='<p class="alert alert-error">Sorry, Insufficient funds!</p>';
    }
     res.render('transfer', {balance: req.session.user.balance, msg: msg});
});
server.use(function(req, res, next){
  res.status(404);
  var msg="Cannot find the page: "+req.url;
        res.render('404', { _404msg: msg});
});
var port = process.env.PORT || 3100;
server.listen(port, function() {
  console.log("Listening on " + port);
});
