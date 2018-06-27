'use strict';

const QueueFactory = require('./queue');
const log = console;
const Room = function Room (name) {
	
	let songs = QueueFactory.new();
	let users = QueueFactory.new();
	this.name = name;

	this.addSong = function(song) {
		let msg = {ROOM: "Adding a song " + song, room: name,	status: "success"};
		if (typeof song !== 'undefined') {
			log.info(msg);
			songs.enqueue(song);
			return true;
		}
		msg.status = "FAILED";
		log.info(msg);
		return false;
	};

	this.nextSong = function() {
		let msg = {ROOM: "Dropping a song " + name,	status: "success"};
		let song = songs.next();
		msg.song = song;
		log.info(msg);
		return song;
	};

	this.dropSong = function() {
		let msg = {ROOM: "Dropping a song " + name,	status: "success"};
		songs.dequeue();
		log.info(msg);
	};

	this.removeSong = function(song) {
		let msg = {ROOM: "Removing a song " + song, room: name,	status: "success"};
		if (typeof song !== 'undefined' && typeof songs.remove(song) !== 'undefined') {
			log.info(msg);
			return true;
		}
		msg.status = "FAILED";
		log.info(msg);
		return false;
	};

	this.songList = function() {
		let msg = {ROOM: "Listing all songs",	status: "success"};
		songs.list();
		log.info(msg);	
	}

	this.addUser = function(user) {
		let msg = {ROOM: "Adding a user " + user, room: name,	status: "success"};
		if (typeof user !== 'undefined') {
			log.info(msg);
			users.enqueue(user);
			return true;
		}
		msg.status = "FAILED";
		log.info(msg);
		return false;
	}

	this.removeUser = function(user) {
		let msg = {ROOM: "Removing a user " + user,	status: "success"};
		if (typeof user !== 'undefined' && typeof users.remove(user) !== 'undefined') {
			log.info(msg);
			return true;
		}
		msg.status = "FAILED";
		log.info(msg);
		return false;
	}

	this.userList = function() {
		let msg = {ROOM: "Listing all users",	status: "success"};
		users.list();
		log.info(msg);	
	}

	this.json = function() {
		let msg = {ROOM: "returning json " + name,	status: "success"};
		log.info(msg);
		let room = { 
			id : this.name,
			readableName : this.name,
			activeUsers : users.count()
		}; 
		return room;
	}
};

const RoomFactory = function RoomFactory () {
	this.new = function(name) {
		return new Room(name);
	};
};

const self = new RoomFactory();

module.exports = self;
