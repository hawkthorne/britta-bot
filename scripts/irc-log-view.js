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
var _start = '\n\
<!DOCTYPE html>\n\
<html>\n\
<head>\n\
	<meta http-equiv="Content-type" content="text/html; charset=utf-8">\n\
	<title>{{title}} Logs</title>\n\
	<style type=\"text/css\">\n\
		body {\n\
			background: #d3d6d9;\n\
			color: #636c75;\n\
			text-shadow: 0 1px 1px rgba(255, 255, 255, .5);\n\
			font-family: Helvetica, Arial, sans-serif;\n\
			margin-top: 70px;\n\
		}\n\
		h1 {\n\
			margin: 8px 0;\n\
			padding: 0;\n\
		}\n\
		li {\n\
			font-size: 13px;\n\
			color: #999;\n\
			list-style-type: none;\n\
			list-style-position: outside;\n\
			padding-bottom: 4px;\n\
		}\n\
		li.message {\n\
			font-size: 14px;\n\
			color: #000;\n\
		}\n\
		span.stamp {\n\
			width: 100px;\n\
			padding-right: 10px;\n\
			text-align: right;\n\
			display: inline-block;\n\
			font-size: 13px;\n\
			color: #999;\n\
		}\n\
		span.user {\n\
			font-weight: bold;\n\
		}\n\
		p {\n\
			border-bottom: 1px solid #eee;\n\
			margin: 6px 0 0 0;\n\
			padding-bottom: 5px;\n\
		}\n\
		p:last-child {\n\
			border: 0;\n\
		}\n\
		div.header {\n\
			position: fixed;\n\
			background-color: inherit;\n\
			width: 100%;\n\
			box-shadow: 0px 0px 15px #555;\n\
			top: 0;\n\
			left: 0;\n\
			padding: 18px 70px;\n\
		}\n\
		.images {\n\
			margin-left: 105px;\n\
		}\n\
		.images img {\n\
			height: 150px;\n\
			padding: 10px;\n\
		}\n\
	</style>\n\
	<script type="text/javascript">\n\
		function load() { window.scrollTo(0, document.body.scrollHeight); };\n\
		window.onload = load;\n\
	</script>\n\
</head>\n\
<body>';

var _channels = '\n\
	<ul>\n\
	{{#channels}}\n\
		<li><a href="{{href}}">{{name}}</a></li>\n\
	{{/channels}}\n\
	</ul>';

var _logs = '\n\
	<div class="header">\n\
		{{title}} Logs\n\
	</div>\n\
	<ul>\n\
	{{#logs}}\n\
		<li class="{{type}}">\n\
		<span class="stamp">{{stamp}}</span>\n\
		{{#is_kick}}\n\
			<span class="user">{{data.user}}</span> was kicked by <span class="user">{{data.by}}</span>{{#data.reason}} ( {{data.reason}} ){{/data.reason}}\n\
		{{/is_kick}}\n\
		{{#is_nick}}\n\
			<span class="user">{{data.from}}</span> changed name to <span class="user">{{data.to}}</span>\n\
		{{/is_nick}}\n\
		{{#is_join}}\n\
			<span class="user">{{data.user}}</span> joined\n\
		{{/is_join}}\n\
		{{#is_part}}\n\
			<span class="user">{{data.user}}</span> left{{#data.reason}} ( {{data.reason}} ){{/data.reason}}\n\
		{{/is_part}}\n\
		{{#is_quit}}\n\
			<span class="user">{{data.user}}</span> quit{{#data.reason}} ( {{data.reason}} ){{/data.reason}}\n\
		{{/is_quit}}\n\
		{{#is_message}}\n\
			<span class="user">{{data.user}}</span>: {{{data.message}}}\n\
		{{/is_message}}\n\
		</li>\n\
	{{/logs}}\n\
	</ul>';

var _end = '\n\
	</body>\n\
</html>';

var log_tmpl = hogan.compile( _start + _logs + _end ),
	channel_tmpl = hogan.compile( _start + _channels + _end );

module.exports = function(robot) {

	robot.router.get( "/logs", function( req, res ) {
		robot.redisclient.keys( 'logs_*', function(err, chans) {
			chans = chans.map( function(a) { a = a.replace('logs_',''); return { name: a, href: '/logs/' + a.replace( /#/g, '$' ) }; } );
			res.end( channel_tmpl.render( { title: robot.name + ' irc ', channels: chans } ) );
		});
	});

	robot.router.get( "/logs/:channel/:page?", function(req, res) {
		var channel = req.params.channel.replace( /\$/g, '#' ),
			page = req.params.page || 1,
			per_page = 100;
		page = page > 1 ? page : 1;
		robot.redisclient.lrange( 'logs_' + channel, ( ( page - 1 ) * per_page ) , ( page * per_page ), function(err, logs) {
			var log_out = [];
			for( var i = logs.length - 1; i >= 0; i-- ) {
				var _new = JSON.parse( logs[i] );
				_new.stamp = time_ago( _new.stamp );
				if( _new.data.message )
					_new.data.message = parse_message( _new.data.message );
				_new['is_' + _new.type] = true;
				log_out.push( _new );
			}
			res.end( log_tmpl.render( { title: channel, logs: log_out } ) );
		});
	});

	function time_ago( time ) {
		var periods = [ "sec", "min", "hr", "day", "week", "month", "year", "decade" ],
			lengths = [ 60, 60, 24, 7, 4.35, 12, 10 ],
			difference = Math.floor( (new Date).getTime() / 1000 ) - Math.floor( time );

		for(var j = 0; difference >= lengths[j] && j < lengths.length-1; j++) {
			difference /= lengths[j];
		}

		difference = Math.round(difference);
		if(difference != 1) { periods[j] += "s"; }
		return difference + " " + periods[j] + " ago";
	};

	function parse_message( message ) {
		var regex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig,
			matches = message.match( regex ),
			images = '';
		for( var i in matches ) {
			if( matches[i].match( /\.(jpe?g|gif|png)$/i ) )
				images += "<a href=\"" + matches[i] + "\" target=\"_blank\"><img src=\"" + matches[i] + "\"></a>";
		}
		if( images ) images = "<div class=\"images\">" + images + "</div>";
		return message.replace( regex, "<a href=\"$1\">$1</a>" ) + images;
	}

}