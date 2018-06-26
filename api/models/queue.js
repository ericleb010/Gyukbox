'use strict';

const Queue = function Queue () {

	let queue = [];

	// copy object helper function
	function copy(obj) {
		let output, v, key;

		output = Array.isArray(obj) ? [] : {};
		for (key in o) {
			v = obj[key];
			output[key] = (typeof v === 'object') ? copy(v) : v;
		}

		return output;
	}

	this.enqueue = function (obj) {
		if (typeof obj !== 'undefined') {
			queue.push(obj);
		}
	};

	this.dequeue = function () {
		const obj = queue.shift();

		return obj;
	};

	this.count = function () {
		return queue.length;
	};

	this.list = function () {
		return copy(queue);
	};
};

const QueueFactory = function QueueFactory () {
	this.new = function() {
		return new Queue();
	};
};

const self = new QueueFactory();

module.exports = self;
