var path = require('path'),
	rootPath = path.normalize(__dirname + '/..'),
	env = process.env.NODE_ENV || 'development';

var config = {

	development: {
		root: rootPath,
		app: {
			name: 'feature-discoverer'
		},
		port: 3003,
		db: 'mongodb://localhost/feature-discoverer-development'
		
	},

	test: {
		root: rootPath,
		app: {
			name: 'feature-discoverer'
		},
		port: 3000,
		db: 'mongodb://localhost/feature-discoverer-test'
		
	},

	production: {
		root: rootPath,
		app: {
			name: 'feature-discoverer'
		},
		port: 3000,
		db: process.env.MONGOHQ_URL || 'mongodb://localhost/feature-discoverer-production'

	}

};

module.exports = config[env];