'use strict';

const QueueFactory = require('./queue');
const log = console;
const MAX_SONG_LENGTH_MS = 600000;
const MAX_CHAT_LINES = 20;
const Room = function Room (name) {

	let songs = QueueFactory.new();
	let users = QueueFactory.new();
	let chat = QueueFactory.new();
	let userSongs = {};
	let songUsers = {};
	this.name = name;
	this.playing = undefined;

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

	const songUntrackable = function(user, song) {
		let msg;
		if (typeof user === 'undefined') {
			msg = "user undefined";
		} else if (typeof song === 'undefined') {
			msg = "song undefined";
		} else if (typeof userSongs[user] !== 'undefined') {
			msg = "user already has a song queued";
		} else if (typeof songUsers[song.songId] !== 'undefined') {
			msg = "song has already been queued";
		} else if (song.songLength > MAX_SONG_LENGTH_MS) {
			msg = 'song too long';
		}
		return msg;
	}

	this.addSong = function(user, song) {
		let msg = {ROOM: "Adding a song " + song, room: name, user: user.id,	status: "success"};

		let err = songUntrackable(user, song);

		if (typeof err !== 'undefined') {
			msg.msg = err;
			msg.status = "FAILED";
			log.info(msg);
			return false;
		}
		trackSongUser(song.songId, user);
		songs.enqueue(song);
		log.info(msg);
		return true;
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
		if (typeof song !== 'undefined') {
			untrackSongUser(song.songId);
		}
		log.info(msg);
		return song;
	};

	this.removeSong = function(song) {
		let msg = {ROOM: "Removing a song " + song, room: name,	status: "success"};
		if (typeof song !== 'undefined' && typeof songs.remove(song) !== 'undefined') {
			untrackSongUser(song.songId);
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
		let msg = {ROOM: "Adding a user " + user.id, room: name,	status: "success"};
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
		let msg = {ROOM: "Removing a user " + user.id,	status: "success"};
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

	this.addChatMsg = function(chatMsg) {
		let msg = {ROOM: "Adding to chat " + chatMsg,	status: "success"};
		if (typeof chatMsg !== 'undefined') {
			log.info(msg);
			chat.enqueue(chatMsg);
			while (chat.count() > MAX_CHAT_LINES) {
				if (typeof chat.dequeue() === 'undefined') {
					break;
				}
			}
			return true;
		}
		msg.status = "FAILED";
		log.info(msg);
		return false;
	}

	this.chatList = function() {
		let msg = {ROOM: "Listing chat messages",	status: "success"};
		let chatList = chat.list();
		log.info(msg);
		return chatList;
	}
};

const RoomFactory = function RoomFactory () {
	this.new = function(name) {
		return new Room(name);
	};
};

const self = new RoomFactory();

module.exports = self;
