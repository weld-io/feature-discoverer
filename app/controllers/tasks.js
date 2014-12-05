var mongoose = require('mongoose');
var Task = mongoose.model('Task');

module.exports = {

	index: function (req, res, next) {
		Task.find(function (err, tasks) {
			if (err) return next(err);
			res.render('tasks/index', {
				title: 'Tasks',
				tasks: tasks
			});
		});
	}

}