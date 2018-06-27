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

		const song = room.dropSong();
		if (typeof song === 'undefined') {
			msg.status = 'no songs queued';

			log.info(msg);

			return;
		}

		msg.song = song;
		msg.nextIn = song.songLength;

		msg.status = 'sending';

		log.debug(msg);

		io.to(room.name).emit('play', song);

		room.timer = setTimeout(function () {
			room.timer = undefined;

			const msg = {
				'route':'socket',
				'action':'timer hit',
				'room':room.name,
			};

			log.info(msg);

			doTimer(room);
		}, song.songLength);

		msg.status = 'success';

		log.info(msg);

		return;
	};

	const emitQueue = function(room, client) {
		const queue = room.json();

		client.emit('queue', queue);
	};

	io.on('connect', function (client) {
		log.info({'route':'socket','action':'connect','data':client.id});

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
			client.join(room.name);

			client.emit('chatList', room.chatList());
			emitQueue(room, client);
		});

		client.on('addSong', function (data) {
			log.info({'route':'socket','action':'addSong','data':data});

			if (typeof room === 'undefined') {
				return;
			}

			room.addSong(client, data);
			emitQueue(room, client);
			doTimer(room);
		});

		client.on('disconnect', function(data) {
			log.info({'route':'socket','action':'disconnect','data':data});

			if (typeof room === 'undefined') {
				return;
			}

			room.removeUser(client);
			client.leave(room.name);
		});

		client.on('addChatMsg', function (data) {
			log.info({'route':'socket','action':'addChatMsg','data':data});

			if (typeof room === 'undefined') {
				return;
			}

			room.addChatMsg(data);

			io.to(room.name).emit('chatList', room.chatList());
		});
	});
};
