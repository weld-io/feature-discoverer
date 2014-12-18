'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var API_PASSWORD = process.env.FEATUREDISCOVERER_PASSWORD;

module.exports = {

	list: function (req, res, next) {
		User.find(null, function (err, users) {
			if (err) {
				return res.json(400, err);
			}
			else {
				return res.json(users);
			}
		});
	},

	// Create new user
	create: function (req, res, next) {
		if (req.query.password === API_PASSWORD) {
			var newUser = new User(req.body);
			newUser.save(function (err) {
				if (err) {
					return res.json(400, err);
				}
				else {
					return res.json(newUser);
				}
			});
		}
		else {
			return res.json(401, 'Unauthorized');
		}
	},

	// Update user
	update: function (req, res, next) {
		User.update(
			{ userId: req.params.user },
			req.body,
			function (updateErr, numberAffected, rawResponse) {
				if (updateErr) {
					res.json(500, updateErr);
				}
				else {
					res.json(200, 'Updated user ' + req.params.user);
				}
			}
		);
	},

	// Delete user
	delete: function (req, res, next) {
		if (req.query.password === API_PASSWORD) {
			var searchParams;
			if (req.params.id === 'ALL') {
				searchParams = {};
			}
			else {
				searchParams = { userId: req.params.user }
			}

			User.remove(
				searchParams,
				function(userErr, numberAffected, rawResponse) {
					if (userErr) {
						res.json(500, userErr);
					}
					else {
						res.json(200, 'Deleted ' + numberAffected + ' users');
					}
				}
			);
		}
		else {
			return res.json(401, 'Unauthorized');
		}
	}

}