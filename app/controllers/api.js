var mongoose = require('mongoose');
var Task = mongoose.model('Task');

module.exports = {

	list: function (req, res, next) {
		var searchQuery = {};
		if (req.query.from) {
			var currentTime = new Date();
			searchQuery = { dateCreated: { "$gte": new Date(req.query.from), "$lt": currentTime } };
		}

		Task.find(searchQuery, null, { sort: {dateCreated: -1} }, function (err, tasks) {
			if (err) {
				return res.json(400, err);
			}
			else {
				return res.json(tasks);
			}
		});
	},

	// Create new task
	// curl -X POST -H "Content-Type: application/json" -d '{ "title": "My title", "description": "Bla bla bla", "reloadNeeded": false }' http://localhost:3002/api/tasks?password=M4EgsuY7PDZi
	// curl -X POST -H "Content-Type: application/json" -d '{ "title": "Cool new feature!", "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam a nunc. In ante metus, gravida vel, bibendum et, mollis vitae, ipsum. Sed leo nibh, pulvinar dignissim, pretium eget, mattis id, erat.", "authors": "Henric, Andres", "url": "http://placekitten.com", "imageUrl": "http://placekitten.com/g/300/300", "reloadNeeded": true, "priority": 2 }' http://localhost:3002/api/tasks?password=M4EgsuY7PDZi
	create: function (req, res, next) {
		if (req.query.password === 'M4EgsuY7PDZi') {
			var newTask = new Task(req.body);
			newTask.save(function (err) {
				if (err) {
					return res.json(400, err);
				}
				else {
					return res.json(newTask);
				}
			});
		}
		else {
			return res.json(401, 'Unauthorized');
		}
	},

	// Delete task
	// curl -X DELETE http://localhost:3002/api/tasks/5477a6f88906b9fc766c843e?password=M4EgsuY7PDZi
	delete: function (req, res, next) {
		if (req.query.password === 'M4EgsuY7PDZi') {
			var searchParams;
			if (req.params.id === 'ALL') {
				searchParams = {};
			}
			else {
				{ _id: req.params.id }
			}

			Task.remove(
				searchParams,
				function(taskErr, numberAffected, rawResponse) {
					if (taskErr) {
						res.json(500, taskErr);
					}
					else {
						res.json(200, 'Deletion complete');
					}
				}
			);
		}
		else {
			return res.json(401, 'Unauthorized');
		}
	}

}