'use strict';

const QueueFactory = require('./queue');
const log = console;
const Room = function Room (name) {

	let songs = QueueFactory.new();
	let users = QueueFactory.new();
	let userSongs = {};
	let songUsers = {};
	this.name = name;
	this.timer = undefined;

	const trackSongUser = function(song, user) {
		userSongs[user] = song;
		songUsers[song] = user;
	}

	const untrackSongUser = function(song) {
		let user;
		if (typeof song !== 'undefined' && typeof songUsers[song] !== 'undefined') {
			user = songUsers[song];
			delete songUsers[song];
			if (typeof userSongs[user] !== 'undefined') {
				delete userSongs[user];
			}
		}
	}

	this.addSong = function(user, song) {
		let msg = {ROOM: "Adding a song " + song, room: name, user: user,	status: "success"};
		if (typeof user !== 'undefined' && typeof song !== 'undefined') { //&& typeof userSongs[user] === 'undefined' && typeof songUsers[song] === 'undefined') {
			trackSongUser(song, user);
			songs.enqueue(song);
			log.info(msg);
			return true;
		}
		msg.status = "FAILED";
		log.info(msg);
		return false;
	};

	this.nextSong = function() {
		let msg = {ROOM: "Returning next song " + name,	status: "success"};
		let song = songs.next();
		msg.song = song;
		log.info(msg);
		return song;
	};

	this.dropSong = function() {
		let msg = {ROOM: "Dropping a song " + name,	status: "success"};
		let song = songs.dequeue();
		untrackSongUser(song);
		log.info(msg);
		return song;
	};

	this.removeSong = function(song) {
		let msg = {ROOM: "Removing a song " + song, room: name,	status: "success"};
		if (typeof song !== 'undefined' && typeof songs.remove(song) !== 'undefined') {
			untrackSongUser(song);
			log.info(msg);
			return true;
		}
		msg.status = "FAILED";
		log.info(msg);
		return false;
	};

	this.songList = function() {
		let msg = {ROOM: "Listing all songs",	status: "success"};
		let songList = songs.list();
		log.info(msg);
		return songList;
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
		let userList = users.list();
		log.info(msg);
		return userList;
	}

	this.json = function() {
		let msg = {ROOM: "returning json " + name,	status: "success"};
		log.info(msg);
		let room = {
			id : this.name,
			readableName : this.name,
			activeUsers : users.count(),
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
