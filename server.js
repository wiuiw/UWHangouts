"use strict";

const express = require("express");
const fs = require("fs");
const app = express();

var options = {
    key: fs.readFileSync("/etc/letsencrypt/live/harim2000-student.me/privkey.pem", "utf8"),
    cert: fs.readFileSync("/etc/letsencrypt/live/harim2000-student.me/fullchain.pem", "utf8"),
    ca: fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/chain.pem', 'utf8')
}

var https = require("https").createServer(options, app);

var io = require("socket.io")(https);
const port = process.env.PORT || 443;

var mysql = require('mysql');
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

//clients folder as root
app.use(express.static("public"));

app.use(session({
	secret: 'uwhangouts',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 60000 }
}))
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/user', function(request, response) {
	response.sendFile(path.join(__dirname + '/public/user.html'));
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

app.post('/signup', function(req, response){
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
 });

//signaling handlers
io.on("connection", function(socket){

    console.log("a user has connected");

    socket.on("create or join", function(room){

        console.log("create or join to room ", room);

        //check for number of users in a room
        var myRoom = io.sockets.adapter.rooms[room] || {length:0};
        var numClients = myRoom.length;
        console.log(room, " has ", numClients, " users");


        //there are no users in that room
        if(numClients == 0){
            socket.join(room);
            socket.emit("created", room);
        }else if(numClients == 1){ //one user in the room
            socket.join(room);
            socket.emit("joined", room);
        }else{ //two users already in the room, cant allow more users
            socket.emit("full", room);
        }
    });
    
    //relay only handlers
    socket.on("ready", function(room){
        socket.broadcast.to(room).emit("ready");
    });

    socket.on("candidate", function(event){
        socket.broadcast.to(event.room).emit("candidate", event);
    });

    socket.on("offer", function(event){
        socket.broadcast.to(event.room).emit("offer", event.sdp);
    });

    socket.on("answer", function(event){
        socket.broadcast.to(event.room).emit("answer", event.sdp);
    });


});

https.listen(port, () => {
    console.info("listening on %d", port)
});