'use strict';

const log = console;
const RoomFactory = require('./room');
const Rooms = function Rooms () {

	let rooms = {};

	this.add = function(name) {
		if (typeof name !== 'undefined' && typeof rooms[name] === 'undefined') {
			rooms[name] = RoomFactory.new();
			return true;
		}
		return false;
	};

	this.get = function(name) {
		if (typeof name !== 'undefined' && typeof rooms[name] !== 'undefined') {
			return rooms[name];
		}
		return;
	}

	this.list = function() {
		return rooms;
	};
};

const self = new Rooms();

module.exports = self;
