"use strict";

//divs
var divSelectRoom = $("#selectRoom");
var divVCRoom = $("#vcRoom");
var errors = $("errors");

//login info
var usernameLI = $("#usernameLI").val();
var passwordLI = $("#passwordLI").val();

//sign up info
var emailSU = $("#emailSU").val();
var usernameSU = $("#usernameSU").val();
var passwordSU = $("#passwordSU").val();

//roomnumber and submitting info with login 
//or sign up info
var inputRoomName = $("#roomName").val();
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

submitLIRoom.onclick = function (){
    if(inputRoomName === ""){
        errors.append("<h2>Please type a room name</h2>");
    } else if(usernameLI === "" || passwordLI === ""){
        errors.append("<h2>Please provide all user login info</h2>");
    } else {
        //check if log in info exists in the users database
        
        //if user exists create the room if it doesnt exist or create it
        //otherwise

        //join the room as that user

        //make the vc div visible and hide the fields to log in or signup
    }
}

submitSURoom.onclick = function (){
    if(inputRoomName === ""){
        errors.append("<h2>Please type a room name</h2>");
    } else if(emailSU === "" || usernameSU === "" || passwordSU === ""){
        errors.append("<h2>Please provide all user sign up info</h2>");
    } else {
        //check if signup info exists in the users database to not have duplicate info

        //create the user if the info is unique and add them to the database
        
        //if user exists create the room if it doesnt exist or create it
        //otherwise

        //join the room as that user

        //make the vc div visible and hide the fields to log in or signup
    }
}