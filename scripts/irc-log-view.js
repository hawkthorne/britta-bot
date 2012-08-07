//Description:
//  Logs irc events to redis
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
//Urls:
//  /logs
//
//Author:
//  jhoff

// require hogan
var hogan = require( 'hogan.js' );

// compile template
var _start = '\
<!DOCTYPE html>\
<html>\
<head>\
	<meta http-equiv="Content-type" content="text/html; charset=utf-8">\
	<title>{{title}} Logs</title>\
</head>\
<body>';

var _channels = '\
	<ul>\
	{{#channels}}\
		<li><a href="{{href}}">{{name}}</a></li>\
	{{/channels}}\
	</ul>';

var _logs = '\
	{{#logs}}\
		{{stamp}} - \
		{{#is_kick}}\
			{{data.user}} was kicked by {{data.by}}{{#data.reason}} ( {{data.reason}} ){{/data.reason}}<br>\
		{{/is_kick}}\
		{{#is_nick}}\
			{{data.from}} changed name to {{data.to}}<br>\
		{{/is_nick}}\
		{{#is_join}}\
			{{data.user}} joined<br>\
		{{/is_join}}\
		{{#is_part}}\
			{{data.user}} left{{#data.reason}} ( {{data.reason}} ){{/data.reason}}<br>\
		{{/is_part}}\
		{{#is_quit}}\
			{{data.user}} quit{{#data.reason}} ( {{data.reason}} ){{/data.reason}}<br>\
		{{/is_quit}}\
		{{#is_message}}\
			{{data.user}}: {{data.message}}<br>\
		{{/is_message}}\
	{{/logs}}';

var _end = '\
</body>\
</html>';

var log_tmpl = hogan.compile( _start + _logs + _end ),
	channel_tmpl = hogan.compile( _start + _channels + _end );

module.exports = function(robot) {

	robot.router.get( "/logs", function( req, res ) {
		robot.redisClient.keys( 'logs_*', function(err, chans) {
			chans = chans.map( function(a) { a = a.replace('logs_',''); return { name: a, href: '/logs/' + a.replace( /#/g, '$' ) }; } );
			res.end( channel_tmpl.render( { title: robot.name + ' irc ', channels: chans } ) );
		});
	});

	robot.router.get( "/logs/:channel/:page?", function(req, res) {
		var channel = req.params.channel.replace( /\$/g, '#' ),
			page = req.params.page || 1,
			per_page = 100;
		page = page > 1 ? page : 1;
		robot.redisClient.lrange( 'logs_' + channel, ( ( page - 1 ) * per_page ) , ( page * per_page ), function(err, logs) {
			var log_out = [];
			for( var i = logs.length - 1; i >= 0; i-- ) {
				var _new = JSON.parse( logs[i] );
				_new['is_' + _new.type] = true;
				log_out.push( _new );
			}
			res.end( log_tmpl.render( { title: channel, logs: log_out } ) );
		});
	});

}