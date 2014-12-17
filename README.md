# Feature Discoverer

API service supporting an interactive guide that can help a user explore an application.

![Feature Discoverer in-app example](example.png)

## How to Run

Just start with:

	# Set password used in API requests
	export FEATUREDISCOVERER_PASSWORD=MYPASSWORD

	grunt

Server will default to **http://localhost:3003**

## API

### Tasks that the user should accomplish

Get the user's task list:

	curl http://localhost:3003/api/tasks?user=USERID

(Note: `USERID` can be anything, e.g. an internal userId or a hashed email address)

Post a list of actions that the user has made:

	curl -X POST -H "Content-Type: application/json" -d '{ "actions": [{ "name": "Login" }, { "name": "Create element", "properties": { "type": "rectangle" } }] }' http://localhost:3003/api/actions?user=USERID

### Admin options

See the master task list:

	curl http://localhost:3003/api/tasks

Create new tasks for users to do:

	curl -X POST -H "Content-Type: application/json" -d '{ "name": "Draw two boxes", "position": 1, "actions": [{ "name": "Create element", "properties": { "type": "rectangle" } }, { "name": "Create element", "properties": { "type": "rectangle" } }] }' http://localhost:3003/api/tasks?password=MYPASSWORD
	curl -X POST -H "Content-Type: application/json" -d '{ "name": "Switch to phone layout", "position": 2, "actions": [{ "name": "Switch responsive view", "properties": { "mode": "phone" } }] }' http://localhost:3003/api/tasks?password=MYPASSWORD
	curl -X POST -H "Content-Type: application/json" -d '{ "name": "Edit design for phone layout", "position": 3, "actions": [{ "name": "Edit responsive breakpoint", "properties": { "breakpoint": "phone" } }] }' http://localhost:3003/api/tasks?password=MYPASSWORD

Update a task:

	curl -X PUT -H "Content-Type: application/json" -d '{ "name": "my_new_task", "redirectUrl": "https://duckduckgo.com" }' http://localhost:3003/api/tasks/548cbb2b1ad50708212193d8?password=MYPASSWORD

Delete a specific task:

	curl -X DELETE http://localhost:3003/api/tasks/5477a6f88906b9fc766c843e?password=MYPASSWORD

Delete all tasks:

	curl -X DELETE http://localhost:3003/api/tasks/ALL?password=MYPASSWORD

Delete all users and usertasks (i.e. clear state/progress but retain the master task list):

	curl -X DELETE http://localhost:3003/api/users/ALL?password=MYPASSWORD

## Implementation

Based on the [Yeoman Express generator](https://github.com/petecoop/generator-express) with the "MVC" option.
Built on Node.js, Express (with EJS) and MongoDB.

## Deploying on Heroku

	# Set up and configure app
	heroku create MYAPPNAME
	heroku addons:add mongolab
	heroku config:set NODE_ENV=production

	# Set password used in API requests
	heroku config:set FEATUREDISCOVERER_PASSWORD=MYPASSWORD