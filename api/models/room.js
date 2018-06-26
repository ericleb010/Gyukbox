'use strict';

const QueueFactory = require('./queue');
const log = console;
const Room = function Room () {
	
	let room = [];
	let songs = QueueFactory.new();

	this.addSong = function(obj) {
		if (typeof obj !== 'undefined') {
			songs.enqueue(obj);
			log.info("Adding a song");
		}
	};

	this.dropSong = function() {
		songs.dequeue();
		log.info("Dropping a song");
	};
};

const RoomFactory = function RoomFactory () {
	this.new = function() {
		return new Room();
	};
};

const self = new RoomFactory();

module.exports = self;
