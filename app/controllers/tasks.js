'use strict';

var mongoose = require('mongoose');
var Task = mongoose.model('Task');

module.exports = {

	index: function (req, res, next) {
		Task.find().sort({ group: 1, position: 1, name: 1 }).exec(function (err, tasks) {
			if (err) return next(err);
			res.render('tasks/index', {
				title: 'Tasks',
				tasks: tasks
			});
		});
	}

}