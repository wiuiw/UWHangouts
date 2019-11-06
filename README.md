# UW Hangouts: A Live Video Chat App
#### Team members: Harim Sanchez, Yue Lyu, Henry Lin

## Project Description

UW Hangouts is an application used for users to communicate with each other through live video feeds. This application will be geared mainly towards UW students but will also be open for the general public to make an account. This application will provide a quick and easy way to connect students to each other without requiring them to download another application to make the video call. We want to make this application because there isn’t yet an application that is geared towards student use and we believe that it would be of great use, being able to add functionality for the user, better geared towards their education.

UW Hangouts is an application used for UW students to communicate with each other through live video feeds. This application could also be eventually extended for other universities and the general public to use.

Why does your audience want to use your application? Please provide some sort of reasoning. 
Reason (private video chat rooms): more focused in an academic environment for students, less distractions like facebook messenger to get work done, encourages/promotes group study sessions or group project discussions online
Reason 2 (public video chat rooms): make UW more inclusive and have public live video chat rooms and streams/broadcasts, help students that feel disconnected/isolated on the UW campus, another way for students to connect with each other or meet other new fellow students

Why do you as developers want to build this application?
Since we are students ourselves, we wanted to create something that we could also use.

## Technical Description

### Infrastructure

This video chat application will rely on Docker containers taking care of microservices. All the users will be able to access the application through a website handled through a domain container. 


| Priority | User | Description |
| ----------- | -------- | ------------------ |
| P0 | As a student | I want to be able to connect to a video call with another person using their username or some kind of identifier |
| P0 | As a student | I want to be able to create an account and log into it |
| P1 | As a student | I want to be able to send text messages back and forth between other students |
| P2 | As a student | I want to be able to send other people invitations to join in my phone call through a link |





### API Design

#### Endpoints
`/v1/users` - user control 
`GET`: get all users’ information
`200`: successfully retrieved all users
`401`: cannot verify user’s session id or no session id is provided
`500`: internal server error
`POST`: create a new user account
`201`: successfully create a new user
`401`: cannot verify user’s session id or no session id is provided
`415`: cannot decode body or receives unsupported body
`500`: internal server error
`/v1/channels` - channels control - for all the chatroom in the web application
`GET`: get all the channels that the users have joined
`200`: successfully retrieved all the channels
`401`: cannot verify user’s session id or no session id is provided
`500`: internal server error
`POST`: create a new chatroom(channel)
`201`: successfully create a new channel 
`401`: cannot verify user’s session id or no session id is provided
`415`: cannot decode body or receives unsupported body
`500`: internal server error
`/v1/channels/:channelid` - specific channel control
`GET`: get a specific channels by the chatid
`200`: successfully get the channel and its information 
`401`: cannot verify user’s session id or no session id is provided
`404`: the channel not found
`500`: internal server error
`POST`: post a new message in the channel
`201`: successfully post the new message in the channel
`401`: cannot verify user’s session id or no session id is provided
`415`: cannot decode body or receives unsupported body
`500`: internal server error
`DELETE`: delete a specific channel 
`200`: successfully delete the channel
`401`: cannot verify user’s session id or no session id is provided
`404`: the channel not found
`500`: internal server error
`/v1/channels/:channelid/members` - manage and modify the members who joined the channel
`GET`: get all members in the channel
`200`: successfully get all the members information in the channel
`401`: cannot verify user’s session id or no session id is provided
`500`: internal server error
`POST`: add new member to the chatroom
`201`: successfully add the new member to the chatroom
`401`: cannot verify user’s session id or no session id is provided
`415`: cannot decode body or receives unsupported body
`500`: internal server error
`DELETE`: delete a user from the current chatroom
`200`: successfully remove the current member from the current chatroom
`401`: cannot verify user’s session id or no session id is provided
`404`: the user is not found in the current chatroom
`500`: internal server error
`/v1/sessions` -  for authentication - user login
`POST`: create a new session for users to log in 
`201`: successfully created a new session
`401`: email or password is incorrect or email does not exist
`415`: cannot decode body or receives unsupported body
`500`: internal server error



#### Models

##### Users
create table if not exists users(
	userId int not null auto_increment primary key,
	uwId varchar(128) not null UNIQUE,
	passHash binary(60) not null,
	firstName varchar(255) not null,
lastName varchar(255) not null,
);

##### Messages
create table if not exists messages(
	messageId int not null auto_increment primary key,
	channelId int not null,
userId int not null,
	body varchar(255) not null,
	sendTime datetime not null,
);

##### Channels
create table if not exists channels(
	channelId int not null auto_increment primary key,
	channelName varchar(255) not null,
createTime datetime not null
	userId int not null,
);
