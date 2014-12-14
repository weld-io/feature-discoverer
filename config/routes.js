// Application routes for REST
'use strict';

var express = require('express');

module.exports = function (app, config) {

	var router = express.Router();
	app.use('/', router);

	// Controllers
	var startController = require(config.root + '/app/controllers/start');
	var apiTasksController = require(config.root + '/app/controllers/api/tasks');
	var tasksController = require(config.root + '/app/controllers/tasks');

	router.get('/', startController.index);

	router.get('/api/tasks', apiTasksController.list);
	router.post('/api/tasks', apiTasksController.create);
	router.put('/api/tasks/:id', apiTasksController.update);
	router.delete('/api/tasks/:id', apiTasksController.delete);

	router.get('/tasks', tasksController.index);

};