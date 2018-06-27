'use strict';

const rooms = require('../models/rooms');
const log = console;

module.exports = function (router) {

	const makeLogMsg = function(req) {
		const msg = {
			'url': req.originalUrl,
			'path': req.path,
			'query': req.query,
			'route': req.route,
		};

		return msg;
	};

	const make = function (req, res, next) {

		const msg = makeLogMsg(req);

		const name = req.params.room;

		msg.data = { 'name': name };

		if (rooms.add(name)) {
			// 201 Created
			res.status(201);

			msg.status = 'success';

		} else {
			// 409 Conflict
			res.status(409);

			msg.status = 'failure';
		}

		res.send('');

		log.info(msg);
	}

	router.route('/add/:room/').put(make).post(make).get(make);

	router.route('/get/:room/').get(function(req, res, next) {
		const name = req.params.room;

		const msg = makeLogMsg(req);

		const room = rooms.get(name);

		if (typeof room === 'undefined') {
			// 404 Not Found
			res.status(404);

			res.send('');

			msg.status = 'failure';

		} else {
			res.status(200);

			res.json(room.json());

			msg.status = 'success';
		}

		log.info(msg);
	});

	router.route('/all/').get(function(req, res, next) {
		const msg = makeLogMsg(req);

		const all = rooms.list();

		res.status(200);

		res.json(all.json());

		log.info(msg);
	});

	router.route('/add/:room/:song/').get(function(req, res, next) {
		const msg = makeLogMsg(req);

		const song = req.params.song;
		const name = req.params.room;

		msg.data = {
			'room': name,
			'song': song,
			'action': 'add',
		};

		const room = rooms.get(name);

		if (typeof room === 'undefined') {
			res.status(404);

			msg.status = 'room not found';

		} else if (!room.addSong(song)) {
			res.status(400);

			msg.status = 'failure';

		} else {
			res.status(201);

			msg.status = 'success';
		}

		res.send('');

		log.info(msg);
	});

	router.route('/get/:room/next').get(function (req, res, next) {
		const msg = makeLogMsg(req);

		const name = req.params.room;

		msg.data = {
			'room': name,
		};

		const room = rooms.get(name);

		if (typeof room === 'undefined') {
			res.status(404).send('');

			msg.status = 'room not found';

			log.info(msg);

			return;
		}

		const song = room.nextSong();

		if (typeof song === 'undefined') {
			res.status(204).send('');

			msg.status = 'no more queued songs';

			log.info(msg);

			return;
		}

		res.status(200);
		res.json(song);

		log.info(msg);
	});

	return router;
}
