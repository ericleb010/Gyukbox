'use strict';

const express = require('express');
const log = console.log;
const app = express();
const router = express.Router();

const rooms = require('./controllers/rooms');

router.get('/', function (req, res, next) {
	res.send('Hello World!')

	next();
});

router.use('/rooms/', rooms(router));

app.use('/api/', router);

const reject = function (req, res, next) {
	res.invalidMethod();

	next();
};

// reject everything but GET
app.put('*', reject)
.delete('*', reject)
.post('*', reject);

app.on('start', function () {
	log.info({ 'event': 'lifecycle', 'action': 'start' });
	log.heartbeat();
});

module.exports = app;
