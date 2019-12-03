"use strict";


//divs
var divSelectRoom = $("#selectRoom");
var divVCRoom = $("#vcRoom");
var errors = $("#errors");
var forms = $("#forms");
var greeting = $("#greeting");

//login info
var usernameLI = $("#usernameLI");
var passwordLI = $("#passwordLI");

//sign up info
var emailSU = $("#emailSU");
var usernameSU = $("#usernameSU");
var passwordSU = $("#passwordSU");

//roomnumber and submitting info with login 
//or sign up info
var inputRoomName = $("#roomName");
var submitLIRoom = $("#goRoomLI");
var submitSURoom = $("#goRoomSU");

//videos
var localVideo = $("#localVideo");
var remoteVideo = $("#remoteVideo");

var roomName;
var localStream;
var remoteStream;
var rtcPeerConnection;

//STUN Servers
var iceServers = {
    'iceServers':[
        {'url':'stun:stun.services.mozilla.com'},
        {'url':'stun:stun.I.google.com:19302'}
    ]
}
var streamConstraints = {audio:true, video:true};
var isCaller;

//Socket.io server
var socket = io();


$(document).ready(function(){
    
    //onclick for submitting Log in for a user into a room
    submitLIRoom.click(function (){
        if(inputRoomName.val() === ""){
            errors.append("<h2>Please type a room name</h2>");
        } else if(usernameLI.val() === "" || passwordLI.val() === ""){
            errors.append("<h2>Please provide all user login info</h2>");
        } else {
            //check if log in info exists in the users database
            
            //if user exists create the room if it doesnt exist or create it
            //otherwise

            //join the room as that user

            //make the vc div visible and hide the fields to log in or signup

            socket.emit("create or join", inputRoomName.val()); //send message to socket server

            forms.hide("slow");
            divVCRoom.show("slow");


        }
    })

    //onclick for submitting sign up for a user into a room
    submitSURoom.click(function (){
        if(inputRoomName.val() === ""){
            errors.append("<h2>Please type a room name</h2>");
        } else if(emailSU.val() === "" || usernameSU.val() === "" || passwordSU.val() === ""){
            errors.append("<h2>Please provide all user sign up info</h2>");
        } else {

            //check if signup info exists in the users database to not have duplicate info

            //create the user if the info is unique and add them to the database
            
            //if user exists create the room if it doesnt exist or create it
            //otherwise

            //join the room as that user

            //make the vc div visible and hide the fields to log in or signup

            socket.emit("create or join", inputRoomName.val()); //send message to socket server

            forms.hide("slow");
            divVCRoom.show("slow");
        }
    })

    //sends signal when socket server is created
    socket.on("created", function(room){
        navigator.mediaDevices.getUserMedia(streamConstraints).then(function(stream){
            localStream = stream;
            localVideo.src = URL.createObjectURL(stream);
            isCaller = true;
        }).catch(function(err){
            console.log("An error occured when retrieving media devices");
        });
    });

    //sends signal when socket server is joined
    socket.on("joined", function(room){
        navigator.mediaDevices.getUserMedia(streamConstraints).then(function(stream){
            localStream = stream;
            localVideo.src = URL.createObjectURL(stream);
            socket.emit("ready", roomName);
        }).catch(function(err){
            console.log("An error occured when retrieving media devices");
        });
    });

    //sends signal when server is ready
    socket.on("ready", function(){
        if(isCaller){
            //create rtc PTP connection
            rtcPeerConnection = new rtcPeerConnection(iceServers);

            //event listeners
            rtcPeerConnection.onicecandidate = onIceCandidate;
            rtcPeerConnection.onaddstream = onAddStream;

            //add local stream to the connection
            rtcPeerConnection.addStream(localStream);

            //prepare an offer
            rtcPeerConnection.createOffer(setLocalAndOffer, function(e){console.log(e)});
        }
    });

    //when servers send out an offer
    socket.on("offer", function(event){
        if(isCaller){
            //prepare rtc PTP connection
            rtcPeerConnection = new rtcPeerConnection(iceServers);

            //event listeners
            rtcPeerConnection.onicecandidate = onIceCandidate;
            rtcPeerConnection.onaddstream = onAddStream;

            //add local stream to the connection
            rtcPeerConnection.addStream(localStream);

            //store offer as remote description
            rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event));

            //prepare answer
            rtcPeerConnection.createAnswer(setLocalAndAnswer, function(e){console.log(e)});

        }
    });
    //when servers send out an answer
    socket.on("answer", function(event){
        //store as remote description
        rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event));
    });

    //when servers send out a candidate
    socket.on("candidate", function(event){
        //create candidate object
        var candidate = new RTCIceCandidate({
            sdpMLineIndex: event.label,
            candidate: event.candidate
        });
        //store candidate
        rtcPeerConnection.addIceCandidate(candidate);
    });

})
