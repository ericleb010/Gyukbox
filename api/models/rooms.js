'use strict';

const log = console;
const RoomFactory = require('./room');
const Rooms = function Rooms () {

	let rooms = {};

	this.add = function(name) {
		let msg = {ROOMS: "Adding a room " + name,	status: "success"};
		if (typeof name !== 'undefined' && typeof rooms[name] === 'undefined') {
			rooms[name] = RoomFactory.new(name);
			log.info(msg);
			return true;
		}
		msg.status = "FAILED";
		log.info(msg);
		return false;
	};

	this.get = function(name) {
		let msg = {ROOMS: "Getting a room " + name,	status: "success"};
		if (typeof name !== 'undefined' && typeof rooms[name] !== 'undefined') {
			log.info(msg);
			return rooms[name];
		}
		msg.status = "FAILED";
		log.info(msg);
		return;
	};

	this.list = function() {
		return this;
	};

	this.json = function() {
		let roomlist = [];
		let msg = {ROOMS: "Getting all rooms",	status: "success"};
		Object.keys(rooms).forEach(key => {
			roomlist.push(rooms[key].json());
		});
		log.info(msg);
		return roomlist;
	};
}

const self = new Rooms();

module.exports = self;
