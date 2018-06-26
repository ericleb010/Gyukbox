'use strict';

const QueueFactory = require('./queue');
const log = console;
const Room = function Room (name) {
	
	let songs = QueueFactory.new();
	this.name = name;

	this.addSong = function(obj) {
		if (typeof obj !== 'undefined') {
			songs.enqueue(obj);
			log.info("ROOM: Adding a song");
		}
	};

	this.dropSong = function() {
		songs.dequeue();
		log.info("ROOM: Dropping a song");
	};

	this.json = function() {
		log.info("ROOM: returning json")
		return this;
	}
};

const RoomFactory = function RoomFactory () {
	this.new = function(name) {
		return new Room(name);
	};
};

const self = new RoomFactory();

module.exports = self;
