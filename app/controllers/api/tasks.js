'use strict';

var mongoose = require('mongoose');
var Task = mongoose.model('Task');

var API_PASSWORD = process.env.FEATUREDISCOVERER_PASSWORD;

module.exports = {

	list: function (req, res, next) {
		var searchQuery = {};
		if (req.query.from) {
			var currentTime = new Date();
			searchQuery = { dateCreated: { "$gte": new Date(req.query.from), "$lt": currentTime } };
		}

		Task.find(searchQuery, null, { sort: {dateCreated: -1} }, function (err, tasks) {
			if (err) {
				return res.json(400, err);
			}
			else {
				return res.json(tasks);
			}
		});
	},

	// Create new task
	create: function (req, res, next) {
		if (req.query.password === API_PASSWORD) {
			var newTask = new Task(req.body);
			newTask.save(function (err) {
				if (err) {
					return res.json(400, err);
				}
				else {
					return res.json(newTask);
				}
			});
		}
		else {
			return res.json(401, 'Unauthorized');
		}
	},

	// Update task
	update: function (req, res, next) {
		Task.update(
			{ _id: req.params.id },
			req.body,
			function (updateErr, numberAffected, rawResponse) {
				if (updateErr) {
					res.json(500, updateErr);
				}
				else {
					res.json(200, 'Updated task ' + req.params.id);
				}
			}
		);
	},

	// Delete task
	delete: function (req, res, next) {
		if (req.query.password === API_PASSWORD) {
			var searchParams;
			if (req.params.id === 'ALL') {
				searchParams = {};
			}
			else {
				searchParams = { _id: req.params.id }
			}

			Task.remove(
				searchParams,
				function(taskErr, numberAffected, rawResponse) {
					if (taskErr) {
						res.json(500, taskErr);
					}
					else {
						res.json(200, 'Deleted ' + numberAffected + ' tasks');
					}
				}
			);
		}
		else {
			return res.json(401, 'Unauthorized');
		}
	}

}