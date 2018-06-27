'use strict';

const log = console;
const socketio = require('socket.io');
const rooms = require('../models/rooms');

module.exports = function (server) {

	const io = socketio(server);

	let doTimer = function (room) {
		let msg = {
			'route':'socket',
			'action':'timer',
			'room': room.name,
		};

		if (typeof room.timer !== 'undefined') {
			msg.status = 'timer undefined';

			log.debug(msg);

			return;
		}

		song = room.dropSong();
		if (typeof song === 'undefined') {
			msg.status = 'no songs queued';

			log.info(msg);

			return;
		}

		msg.song = song;
		msg.nextIn = song.songLength;

		msg.status = 'sending';

		log.debug(msg);

		room.userList().forEach(function(client) {
			log.info("TEST");
			client.emit('play', song);
		});

		room.timer = setTimeout(function () {
			room.timer = undefined;

			doTimer(room);
		}, song.songLength);

		msg.status = 'success';

		log.info(msg);

		return;
	};

	io.on('connect', function (client) {
		log.info({'route':'socket','action':'connect','data':client});

		let room;

		client.on('join', function (data) {
		 	log.info({'route':'socket','action':'join','data':data});

			if (typeof room !== 'undefined') {
				room.removeUser(client);
			}

			room = rooms.get(data.room);

			// default to lobby
			if (typeof room === 'undefined') {
				room = rooms.get('Lobby');
			}

			room.addUser(client);
		});

		client.on('addSong', function (data) {
			log.info({'route':'socket','action':'addSong','data':data});

			if (typeof room !== 'undefined') {
				room.addSong(client, data);

				doTimer(room);
			}
		});

		client.on('nextSong', function (data) {
			log.info({'route':'socket','action':'nextSong','data':data});

			io.emit('nextSong', room.nextSong());
		});

		client.on('disconnect', function(data) {
			log.info({'route':'socket','action':'disconnect','data':data});

			if (typeof room !== 'undefined') {
				room.removeUser(client);
			}
		});
	});
};
