'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var TaskSchema = new Schema({
	title: { type: String, required: true },
	description: String,
	dateCreated: { type: Date, default: Date.now, index: true },
});

mongoose.model('Task', TaskSchema);