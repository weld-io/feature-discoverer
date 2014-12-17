'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// a Task consists of one or more Actions
var Action = new Schema({
	name: { type: String, required: true },
	properties: {}
});

var TaskSchema = new Schema({
	name: { type: String, required: true },
	position: Number,
	description: String,
	dateCreated: { type: Date, default: Date.now, index: true },
	actions: [Action],
	requiresTasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
});

TaskSchema.statics.getOrderedList = function(callback) {
	var Task = mongoose.model('Task');
	Task.find(null, null, { sort: {position: 1, name: 1} }, callback);
};

mongoose.model('Task', TaskSchema);