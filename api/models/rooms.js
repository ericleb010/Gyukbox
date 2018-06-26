'use strict';

const log = console;
const RoomFactory = require('./room');
const Rooms = function Rooms () {

	let rooms = {};

	this.add = function(name) {
		if (typeof name !== 'undefined' && typeof rooms[name] === 'undefined') {
			rooms[name] = RoomFactory.new(name);
			log.info("ROOMS: Adding a room" + name);
			return true;
		}
		log.info("ROOMS: Adding a room - FAILED");
		return false;
	};

	this.get = function(name) {
		if (typeof name !== 'undefined' && typeof rooms[name] !== 'undefined') {
			log.info("ROOMS: Getting a room " + name);
			return rooms[name];
		}
		log.info("ROOMS: Getting a room - FAILED");
		return;
	}

	this.list = function() {
		return rooms;
	};
};

const self = new Rooms();

module.exports = self;
