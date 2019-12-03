var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
	host     : 'remotemysql.com',
	user     : 'rKs50nvwUK',
	password : '4Y3r4Da0JP',
	database : 'rKs50nvwUK'
});

global.db = connection;

var app = express();

app.use(session({
	secret: 'uwhangouts',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 60000 }
}))
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/user', function(request, response) {
	response.sendFile(path.join(__dirname + '/user.html'));
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Invalid Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Enter your Username and Password');
		response.end();
	}
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

signup = function(req, response){
   if(req.method == "POST"){
      var post  = req.body;
      var username= post.username;
      var password= post.password;
      var email= post.email;
 
      var sql = "INSERT INTO `accounts`(`email`,`username`, `password`) VALUES ('" + email + "','" + username + "','" + password + "')";
 
      var query = db.query(sql, function(err, result) {
	  	response.send('Your account had been successfully created.');
      });
 
   } else {
		response.send('Failed to sign up');
		response.end();
   }
};

app.post('/signup', signup);

app.listen(3000);