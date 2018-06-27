'use strict';

const log = console;
const socketio = require('socket.io');
const rooms = require('../models/rooms');

module.exports = function (server) {

	const io = socketio(server);

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

			room.addSong(data);
		});

		client.on('nextSong', function (data) {
			log.info({'route':'socket','action':'nextSong','data':data});

			io.emit('nextSong', room.nextSong());
		});

		client.on('disconnect', function(data) {
			log.info({'route':'socket','action':'disconnect','data':data});

			room.removeUser(client);
		});
	});
};
