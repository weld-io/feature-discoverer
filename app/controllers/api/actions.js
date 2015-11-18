'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');

var Task = mongoose.model('Task');
var User = mongoose.model('User');

var API_PASSWORD = process.env.FEATUREDISCOVERER_PASSWORD;

var doesActionMatchTask = function (action, task, actionStep) {
	var actionsMatch = (actionStep <= task.actions.length);
	// Check if names match
	var taskAction = task.actions[actionStep - 1];
	if (action.name !== taskAction.name)
		actionsMatch = false;
	// Check if all properties match
	for (var prop in taskAction.properties) {
		// If Action lacks properties (but taskAction has), or has properties but values don't match
		if ( !action.properties || (action.properties && action.properties[prop] !== taskAction.properties[prop]) )
			actionsMatch = false;
	};
	return actionsMatch;
};

var hasUserCompletedTask = function (user, taskName) {
	var usertaskIndex = user.getUserTaskIndex({ name: taskName });
	if (usertaskIndex !== undefined && user.usertasks[usertaskIndex].completed === true) {
		return true;
	}
	else {
		return false;
	}
};

module.exports = {

	// User has performed new actions
	create: function (req, res, next) {

		// Basic error checking
		if (req.body.actions && req.query.user) {

			// Get or create user
			User.findOrCreate({ userId: req.query.user }, function (err, user, created) {
				var resultList = [];
				// Get the Master Task List
				Task.getOrderedList(req.query.group, function (err, tasks) {
					// For each Task in Master Task List
					for (var t in tasks) {
						var resultMasterTask = tasks[t].toObject();
						resultMasterTask.slug = tasks[t].slug();
						var resultUserTask = { name: tasks[t].name };
						// For each action...
						for (var a in req.body.actions) {
							var action = req.body.actions[a];
							// If Task doesn't already exist in UserTasks and this action matches first Task.action, add it
							var userTaskIndex = user.getUserTaskIndex(tasks[t]);
							if (userTaskIndex !== undefined) {
								// User has this task already
								var usertask = user.usertasks[userTaskIndex];
								if (!usertask.completed && doesActionMatchTask(action, tasks[t], usertask.progress + 1)) {
									usertask.progress += 1;
									if (usertask.progress === tasks[t].actions.length) {
										usertask.completed = true;
									}
									user.save(function (err) { });
								}
								resultUserTask = usertask.toObject();
							}
							else {
								// New task for user
								if (doesActionMatchTask(action, tasks[t], 1)) {
									user.usertasks.push({ name: tasks[t].name, progress: 1, completed: (tasks[t].actions.length === 1 ? true : false), originalTask: tasks[t]._id });
									resultUserTask = user.usertasks[user.usertasks.length - 1].toObject();
									user.save(function (err) { });
								}
							}
						};
						// Update result list
						resultUserTask = _.extend(resultMasterTask, resultUserTask);
						// Only show tasks that 1) doesn't require other task, or 2) user has completed required task
						if (!resultUserTask.requiresTask || hasUserCompletedTask(user, resultUserTask.requiresTask)) {
							resultUserTask.progress = resultUserTask.progress | 0;
							resultUserTask.progressMax = resultMasterTask.actions.length;
							resultUserTask.progressPercent = 100 * resultUserTask.progress / resultUserTask.progressMax;
							resultList.push(resultUserTask);
						}
					}
					// Results
					res.json(200, resultList);
				});
			});

		}
		else {
			if (!req.query.user)
				res.json(401, 'User not specified');
			else
				res.json(400, 'Could not process that request.');
		}

	}

}