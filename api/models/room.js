'use strict';

const QueueFactory = require('./queue');
const log = console;
const Room = function Room (name) {
	
	let songs = QueueFactory.new();
	this.name = name;

	this.addSong = function(obj) {
		let msg = {ROOM: "Adding a song " + name,	status: "success"};
		if (typeof obj !== 'undefined') {
			songs.enqueue(obj);
			log.info(msg);
		}
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

	this.json = function() {
		let msg = {ROOM: "returning json " + name,	status: "success"};
		log.info(msg);
		let room = { 
			Room : {
				id : this.name,
				readableName : this.name,
				activeUsers : 0
			}
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
