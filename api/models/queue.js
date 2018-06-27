'use strict';
const _ = require('lodash');

const Queue = function Queue () {

	let queue = [];

	// copy object helper function
	function copy(obj) {
		return _.cloneDeep(obj);
	}

	this.enqueue = function (obj) {
		if (typeof obj !== 'undefined') {
			queue.push(obj);
		}
	};

	this.next = function () {
		const obj = queue[0];
		return obj;
	};

	this.dequeue = function () {
		const obj = queue.shift();
		return obj;
	};

	this.count = function () {
		return queue.length;
	};

	this.remove = function (obj) {
		if (typeof obj !== 'undefined' && queue.indexOf(obj) >= 0) {
			queue.splice(queue.indexOf(obj),1);
			return obj;
		}
		return;
	}

	this.list = function () {
		//return copy(queue);
		const q = queue;
		return q;
	};
};

const QueueFactory = function QueueFactory () {
	this.new = function() {
		return new Queue();
	};
};

const self = new QueueFactory();

module.exports = self;
