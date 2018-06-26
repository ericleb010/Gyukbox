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

		next();
	}

	router.route('/:room/add').put(make).post(make);

	router.route('/:room/').get(function(req, res, next) {
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

		next();
	});

	router.route('/').get(function(req, res, next) {
		const msg = makeLogMsg(req);

		const all = rooms.all();

		res.status(200);

		res.json(all.json());

		log.info(msg);
	});

	return router;
}
