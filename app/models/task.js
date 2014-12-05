// Example model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var TaskSchema = new Schema({
	title: { type: String, required: true },
	description: String,
	dateCreated: { type: Date, default: Date.now, index: true },
});

// TaskSchema.virtual('date')
// 	.get(function(){
// 		return this._id.getTimestamp();
// 	});

mongoose.model('Task', TaskSchema);