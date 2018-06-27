'use strict';

const http = require('http');
const app = require('./index');
const log = console;

/*
 * Create and start HTTP server.
 */

const server = http.createServer(app);

const port = process.env.PORT || 8080;

server.listen(port);
server.on('listening', function () {
	log.info({ 'event': 'lifecycle', 'action': 'listen', 'port': port });
});

process.on('SIGTERM', function () {
	log.info('Received SIGTERM');
	server.close(function () {
		process.exit(0);
	});
	setTimeout(function () {
		console.log('Timed out waiting for connections to close; exiting.');
		process.exit();
	}, 60000);
});
