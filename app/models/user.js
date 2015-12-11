'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate');
var Task = mongoose.model('Task');

var UserTask = new Schema({
	name: { type: String, required: true },
	progress: Number, // = number of Actions completed
	completed: { type: Boolean, default: false },
	dateModified: { type: Date, default: Date.now },
	originalTask: { type: Schema.Types.ObjectId, ref: 'Task' }
});

var UserSchema = new Schema({
	userId: { type: String, required: true, unique: true },
	usertasks: [UserTask]
});

UserSchema.plugin(findOrCreate);

UserSchema.methods.getUserTaskIndex = function (task) {
	for (var u in this.usertasks) {
		if (this.usertasks[u].name === task.name)
			return u;
	};
	return undefined;
};

mongoose.model('User', UserSchema);