'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Task = mongoose.model('Task');
var apiActionsController = require('./actions');

var API_PASSWORD = process.env.FEATUREDISCOVERER_PASSWORD;

module.exports = {

	list: function (req, res, next) {

		if (req.query.user) {
			// User list
			apiActionsController.create({ body: { actions: [{ name: 'null-task' }] }, query: req.query }, res, next);
		}
		else {
			// Full list
			Task.getOrderedList(function (err, tasks) {
				if (err) {
					res.json(400, err);
				}
				else {
					res.json(tasks);
				}
			});
		}
	},

	// Create new task
	create: function (req, res, next) {
		if (req.query.password === API_PASSWORD) {
			var newTask = new Task(req.body);
			newTask.save(function (err) {
				if (err) {
					res.json(400, err);
				}
				else {
					res.json(newTask);
				}
			});
		}
		else {
			res.json(401, 'Unauthorized');
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
			res.json(401, 'Unauthorized');
		}
	}

}