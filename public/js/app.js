"use strict";

//divs
var divSelectRoom = $("#selectRoom");
var divVCRoom = $("#vcRoom");
var error = $("#error");
var forms = $("#forms");
var greeting = $("#greeting");

//room name and submitting info with login 
//or sign up info
var inputRoomName = $("#roomName");
var submitRoom = $("#goRoom");

//videos
var localVideo = document.getElementById("localVideo");
var remoteVideo = document.getElementById("remoteVideo");

var roomName;
var localStream;
var remoteStream;
var rtcPeerConnection;

//STUN Servers
var iceServers = {
    'iceServers': [
        { 'urls': 'stun:stun.services.mozilla.com' },
        { 'urls': 'stun:stun.l.google.com:19302' }
    ]
}
var streamConstraints = {audio:true, video:true};
var isCaller;

//Socket.io server
var socket = io();

//onclick for submitting sign up for a user into a room
submitRoom.click(function (){
    if(inputRoomName.val() === ""){
        error.text("Please type a room name");
    } else {

        roomName = inputRoomName.val();

        greeting.css("display", "block");
        greeting.append("<h2>Welcome to room " + inputRoomName.val()/* + ", " + usernameLI.val()*/);


        //check if signup info exists in the users database to not have duplicate info

        //create the user if the info is unique and add them to the database
        
        //if user exists create the room if it doesnt exist or create it
        //otherwise

        //join the room as that user

        //make the vc div visible and hide the fields to log in or signup

        socket.emit("create or join", roomName); //send message to socket server

        forms.css("display", "none");
        divVCRoom.css("display", "block");

    }
})

//sends signal when socket server is created
socket.on('created', function (room) {
    navigator.mediaDevices.getUserMedia(streamConstraints).then(function (stream) {
        localStream = stream;
        localVideo.srcObject = stream;
        isCaller = true;
    }).catch(function (err) {
        console.log('An error ocurred when accessing media devices', err);
    });
});

socket.on('joined', function (room) {
    navigator.mediaDevices.getUserMedia(streamConstraints).then(function (stream) {
        localStream = stream;
        localVideo.srcObject = stream;
        socket.emit('ready', roomName);
    }).catch(function (err) {
        console.log('An error ocurred when accessing media devices', err);
    });
});

//sends signal when server is ready
socket.on("ready", function(){
    if(isCaller){
        //create rtc PTP connection
        rtcPeerConnection = new RTCPeerConnection(iceServers);

        //event listeners
        rtcPeerConnection.onicecandidate = onIceCandidate;
        rtcPeerConnection.ontrack = onAddStream;
        rtcPeerConnection.addTrack(localStream.getTracks()[0], localStream);
        rtcPeerConnection.addTrack(localStream.getTracks()[1], localStream);

        rtcPeerConnection.createOffer()
            .then(sessionDescription => {
                rtcPeerConnection.setLocalDescription(sessionDescription)
                socket.emit("offer", {
                    type:"offer",
                    sdp:sessionDescription,
                    room:roomName
                })
            }).catch(e => {
                console.log(e);
            });

    }
});

//when servers send out an offer
socket.on("offer", function(event){
    if(!isCaller){
        //prepare rtc PTP connection
        rtcPeerConnection = new RTCPeerConnection(iceServers);

        //event listeners
        rtcPeerConnection.onicecandidate = onIceCandidate;
        rtcPeerConnection.ontrack = onAddStream;

        rtcPeerConnection.addTrack(localStream.getTracks()[0], localStream);
        rtcPeerConnection.addTrack(localStream.getTracks()[1], localStream);
        rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event));

        rtcPeerConnection.createAnswer()
            .then(sessionDescription => {
                rtcPeerConnection.setLocalDescription(sessionDescription)
                socket.emit("answer", {
                    type:"answer",
                    sdp:sessionDescription,
                    room:roomName
                })
            }).catch(e => {
                console.log(e);
            });


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

socket.on("full", function(room){
    error.text("This room is currently full. Refresh and join another room")
    greeting.css("display", "none");
})

//helps a user receive the video and audio of another user
function onAddStream(event){
    remoteVideo.srcObject = event.streams[0];
    remoteStream = event.stream;
}

//listener for the p2p connection that sends a candidate message to the server
function onIceCandidate(event){
    if(event.candidate){
        console.log("sending ice candidate");
        socket.emit("candidate",{
            type:"candidate",
            label:event.candidate.sdpMLineIndex,
            id:event.candidate.sdpMid,
            candidate:event.candidate.candidate,
            room: roomName
        });
    }
}
