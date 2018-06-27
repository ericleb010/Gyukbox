'use strict';

const log = console;
const socketio = require('socket.io');
const rooms = require('../models/rooms');
const _ = require('lodash');

module.exports = function (server) {

	const io = socketio(server);

	let doTimer = function (room) {
		let msg = {
			'route':'socket',
			'action':'timer',
			'room': room.name,
		};

		if (typeof room.playing !== 'undefined') {
			msg.status = 'currently playing';
			msg.song = room.playing.song;

			log.debug(msg);

			return;
		}

		const song = room.dropSong();
		if (typeof song === 'undefined') {
			msg.status = 'no songs queued';

			log.info(msg);

			return;
		}

		room.playing = {
			'start' : (new Date).getTime(),
			'song' : song,
		};

		msg.song = song;
		msg.nextIn = song.songLength;

		io.to(room.name).emit('play', song);

		room.playing.timer = setTimeout(function () {
			room.playing = undefined;

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

	const emitQueue = function(room, emitter) {
		const queue = room.songList();

		emitter.emit('queue', {'queue':queue});
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

			client.emit('chatList', room.chatList(), function (answer) {
				log.info({'room':room,'action':'join chatlist ack','answer':answer});
			});
			emitQueue(room, client);

			// send back video to start playing
			if (typeof room.playing !== 'undefined') {

				const song = _.cloneDeep(room.playing.song);
				song.offset = (new Date).getTime() - room.playing.start;

				client.emit('play', song, function (answer) {
					log.info({'room':room,'action':'join play ack','answer':answer});
				});

				log.info({'msg':"SENT CURRENT PLAYING",'song':song});
			}
		});

		const roomFunctions = {
			'addSong': function (data) {
				room.addSong(client, data);
				emitQueue(room, io.to(room.name));
				doTimer(room);
			},
			'disconnect': function (data) {
				room.removeUser(client);
				client.leave(room.name);
			},
			'addChatMsg': function (data) {
				room.addChatMsg(data);
				io.to(room.name).emit('chatList', room.chatList());
			},
			'downvote': function (data) {
				room.downvote(client, data);
				emitQueue(room, io.to(room.name));
			},
		};

		Object.keys(roomFunctions).forEach(function (action) {
			client.on(action, function(data) {
				log.info({'route':'socket','action':action,'data':data});

				if (typeof room === 'undefined') {
					return;
				}

				roomFunctions[action](data);
			});
		});
	});
};
