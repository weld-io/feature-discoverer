'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// a Task consists of one or more Actions
var Action = new Schema({
	name: { type: String, required: true },
	properties: {},
	elementSelector: String
});

var TaskSchema = new Schema({
	group: String, // group id, default is undefined
	name: { type: String, required: true, unique: true },
	position: Number,
	description: String,
	dateCreated: { type: Date, default: Date.now, index: true },
	actions: [Action],
	requiresTask: String, // Name of other tasks
	elementSelector: String // JQuery-style selector e.g. '#button-save'
});

TaskSchema.statics.getOrderedList = function (group, callback) {
	var Task = mongoose.model('Task');
	Task.find({ group: group }, null, { sort: { position: 1, name: 1 } }, callback);
};

TaskSchema.methods.slug = function (task) {
	return this.name.trim().replace(/ /g,'-').replace(/[^\w-]+/g,'').toLowerCase();
};

mongoose.model('Task', TaskSchema);