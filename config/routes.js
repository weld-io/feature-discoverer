/**
 * Application routes for REST
 */
var express = require('express');

module.exports = function (app, config) {

	var router = express.Router();
	app.use('/', router);

	// Controllers
	var startController = require(config.root + '/app/controllers/start');
	var apiController = require(config.root + '/app/controllers/api');
	var tasksController = require(config.root + '/app/controllers/tasks');

	router.get('/', startController.index);

	router.get('/api/tasks', apiController.list);
	router.post('/api/tasks', apiController.create);
	router.delete('/api/tasks/:id', apiController.delete);

	router.get('/tasks', tasksController.index);

};