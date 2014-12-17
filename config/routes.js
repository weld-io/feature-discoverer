// Application routes for REST
'use strict';

var express = require('express');

module.exports = function (app, config) {

	var router = express.Router();
	app.use('/', router);

	// Controllers
	var startController = require(config.root + '/app/controllers/start');
	var apiTasksController = require(config.root + '/app/controllers/api/tasks');
	var apiActionsController = require(config.root + '/app/controllers/api/actions');
	var apiUsersController = require(config.root + '/app/controllers/api/users');
	var tasksController = require(config.root + '/app/controllers/tasks');

	// API: Tasks
	router.get('/api/tasks', apiTasksController.list);
	router.post('/api/tasks', apiTasksController.create);
	router.put('/api/tasks/:id', apiTasksController.update);
	router.delete('/api/tasks/:id', apiTasksController.delete);

	// API: Actions
	router.post('/api/actions', apiActionsController.create);

	// API: Users
	router.get('/api/users', apiUsersController.list);
	router.delete('/api/users/:id', apiUsersController.delete);

	router.get('/tasks', tasksController.index);

	// Landing page
	router.get('/', startController.index);

};