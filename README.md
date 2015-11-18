# Feature Discoverer / Tutorial Engine

API service supporting a tutorial/interactive guide that can help a user explore an application.

![Feature Discoverer in-app example](example.png)

## How to Run

Just start with:

	# Set password used in API requests
	export FEATUREDISCOVERER_PASSWORD=MYPASSWORD

	grunt

Server will default to **http://localhost:3003**

## Core concepts

* A **task** is a “mission” for the user to complete.
* A task consists of one or multiple **actions**.
* A task may **require another task** to be completed, before the new task is available to the user (see `requiresTask` property).
* Tasks may belong to a **group**, if you want to have multiple tutorials.

## API

### Tasks that the user should accomplish

Get the user's task list:

	curl http://localhost:3003/api/tasks?user=USERID&group=[GROUPNAME]

Notes:

* `USERID` can be anything, e.g. an internal userId or a hashed email address.
* `GROUPNAME` is used to separate sets of tutorials. Can be omitted, and will then return tasks with no group defined.

Post a list of actions that the user has made:

	curl -X POST -H "Content-Type: application/json" -d '{ "actions": [{ "name": "Login" }, { "name": "Create element", "properties": { "type": "rectangle" } }] }' http://localhost:3003/api/actions?user=USERID

### Administration: Master Task List

Get the master task list:

	curl http://localhost:3003/api/tasks

(HTML version available at: `http://localhost:3003/tasks`)

Create new tasks for users to do:

	curl -X POST -H "Content-Type: application/json" -d '{ "name": "Draw two boxes", "position": 1, "actions": [{ "name": "Create element", "properties": { "type": "rectangle" } }, { "name": "Create element", "properties": { "type": "rectangle" } }], "description": "Use the Box tool in the toolbar.", "elementSelector": "#tool_rectangle" }' http://localhost:3003/api/tasks?password=MYPASSWORD
	curl -X POST -H "Content-Type: application/json" -d '{ "name": "Switch to phone layout", "position": 2, "actions": [{ "name": "Switch responsive view", "properties": { "mode": "phone" } }], "description": "", "elementSelector": ".breakpoint-button.phone" }' http://localhost:3003/api/tasks?password=MYPASSWORD
	curl -X POST -H "Content-Type: application/json" -d '{ "name": "Edit design for phone layout", "position": 3, "actions": [{ "name": "Edit responsive breakpoint", "properties": { "breakpoint": "phone" } }], "description": "Toggle the Editing all switch.", "elementSelector": ".responsive-breakpoints" }' http://localhost:3003/api/tasks?password=MYPASSWORD

Update a task:

	curl -X PUT -H "Content-Type: application/json" -d '{ "description": "Click a <a>link</a>." }' http://localhost:3003/api/tasks/5492905d47b6d9e33e4b4f45?password=MYPASSWORD

Delete a specific task:

	curl -X DELETE http://localhost:3003/api/tasks/5477a6f88906b9fc766c843e?password=MYPASSWORD

Delete all tasks:

	curl -X DELETE http://localhost:3003/api/tasks/ALL?password=MYPASSWORD

### Administration: User Status

Delete one user:

	curl -X DELETE http://localhost:3003/api/users/USERID?password=MYPASSWORD

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