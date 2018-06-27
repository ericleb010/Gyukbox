'use strict';

const QueueFactory = require('./queue');
const log = console;
const Room = function Room (name) {
	
	let songs = QueueFactory.new();
	this.name = name;

	this.addSong = function(song) {
		let msg = {ROOM: "Adding a song " + song, room: name,	status: "success"};
		if (typeof song !== 'undefined') {
			log.info(msg);
			songs.enqueue(song);
			return true;
		}
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
