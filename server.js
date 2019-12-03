"use strict";

const express = require("express");
const app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
const port = process.env.PORT || 3000;

//clients folder as root
app.use(express.static("public"));

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

http.listen(port, () => {
    console.info("listening on %d", port)
});

