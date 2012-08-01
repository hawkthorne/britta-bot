//Description:
//  A simple interaction with the built in HTTP Daemon
//
//Dependencies:
//  None
//
//Configuration:
//  None
//
//Commands:
//  None
//
//URLS:
//  /version
//  /ping
//  /time
//  /info
//  /

var spawn = require('child_process').spawn;

module.exports = function(robot) {

	robot.router.get( "/version", function(req, res) {
		res.end( robot.version );
	});

	robot.router.post( "/hubot/ping", function(req, res) {
		res.end( "PONG" );
	});

	robot.router.get( "/ping", function(req, res) {
		res.end( "PONG" );
	});

	robot.router.get( "/time", function(req, res) {
		res.end( "Server time is: " + ( new Date() ) );
	});

	robot.router.get( "/", function(req, res) {
		res.writeHead( 302, { 'Location': '/help' } );
		res.end();
	});

	robot.router.get( "/info", function(req, res) {
		var child = spawn('/bin/sh', ['-c', "echo I\\'m $LOGNAME@$(hostname):$(pwd) \\($(git rev-parse HEAD)\\)"]);

		child.stdout.on( 'data', function(data) {
			res.end( "#{data.toString().trim()} running node #{process.version} [pid: #{process.pid}]" );
			child.stdin.end();
		});
	});
};