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
		html, body, div, span, applet, object, iframe,\n\
		h1, h2, h3, h4, h5, h6, p, blockquote, pre,\n\
		a, abbr, acronym, address, big, cite, code,\n\
		del, dfn, em, img, ins, kbd, q, s, samp,\n\
		small, strike, strong, sub, sup, tt, var,\n\
		b, u, i, center,\n\
		dl, dt, dd, ol, ul, li,\n\
		fieldset, form, label, legend,\n\
		table, caption, tbody, tfoot, thead, tr, th, td,\n\
		article, aside, canvas, details, embed, \n\
		figure, figcaption, footer, header, hgroup, \n\
		menu, nav, output, ruby, section, summary,\n\
		time, mark, audio, video {\n\
			margin: 0;\n\
			padding: 0;\n\
			border: 0;\n\
			font-size: 100%;\n\
			font: inherit;\n\
			vertical-align: baseline;\n\
		}\n\
		/* HTML5 display-role reset for older browsers */\n\
		article, aside, details, figcaption, figure, \n\
		footer, header, hgroup, menu, nav, section {\n\
			display: block;\n\
		}\n\
		body {\n\
			line-height: 1;\n\
		}\n\
		ol, ul {\n\
			list-style: none;\n\
		}\n\
		blockquote, q {\n\
			quotes: none;\n\
		}\n\
		blockquote:before, blockquote:after,\n\
		q:before, q:after {\n\
			content: \'\';\n\
			content: none;\n\
		}\n\
		table {\n\
			border-collapse: collapse;\n\
			border-spacing: 0;\n\
		}\n\
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
			margin-left: 140px;\n\
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
			margin-left: -140px;\n\
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
		.images img {\n\
			height: 150px;\n\
			padding: 10px;\n\
		}\n\
		ul {\n\
			line-height: 18px;\n\
		}\n\
		.pagination {\n\
			float: right;\n\
			margin-right: 100px;\n\
		}\n\
		.pagination .current {\n\
			padding: 0px 12px;\n\
		}\n\
		.link {\n\
			background: #fff;\n\
			width: 700px;\n\
			padding: 10px;\n\
			margin-top: 10px;\n\
			color: #333;\n\
			margin-bottom: 10px;\n\
			min-height: 120px;\n\
			border: 1px solid #999;\n\
			-webkit-border-radius:5px;\n\
			-moz-border-radius:5px;\n\
			border-radius:5px;\n\
			-webkit-box-shadow:2px 2px 7px -2px #333;\n\
			-moz-box-shadow:2px 2px 7px -2px #333;\n\
			box-shadow:2px 2px 7px -2px #333;\n\
			filter: progid:DXImageTransform.Microsoft.dropshadow(OffX=2px, OffY=2px, Color=\'#333\');\n\
			-ms-filter:"progid:DXImageTransform.Microsoft.dropshadow(OffX=2px, OffY=2px, Color=\'#333\')";\n\
		}\n\
		.link .thumb img {\n\
			max-height: 100px;\n\
			float: left;\n\
		}\n\
		.link .title {\n\
			font-size: 16px;\n\
			text-decoration: none;\n\
			display: block;\n\
			margin-bottom: 8px;\n\
			color: #000;\n\
		}\n\
	</style>\n\
	<script type="text/javascript">\n\
		function load() { window.scrollTo(0, document.body.scrollHeight); };\n\
		window.onload = load;\n\
	</script>\n\
	<script type="text/javascript">\n\
		var _gaq = _gaq || [];\n\
		_gaq.push(["_setAccount", "UA-33995171-1"]);\n\
		_gaq.push(["_trackPageview"]);\n\
		(function() {\n\
			var ga = document.createElement("script"); ga.type = "text/javascript"; ga.async = true;\n\
			ga.src = ("https:" == document.location.protocol ? "https://ssl" : "http://www") + ".google-analytics.com/ga.js";\n\
			var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ga, s);\n\
		})();\n\
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
		<div class="pagination">\n\
			{{#pagination.prev}}<a href="/logs/{{base}}/{{pagination.prev}}">&lt;&lt;</a>{{/pagination.prev}}\n\
			{{^pagination.prev}}&lt;&lt;{{/pagination.prev}}\n\
			<span class="current">{{pagination.page}}</span>\n\
			{{#pagination.next}}<a href="/logs/{{base}}/{{pagination.next}}">&gt;&gt;</a>{{/pagination.next}}\n\
			{{^pagination.next}}&gt;&gt;{{/pagination.next}}\n\
		</div>\n\
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
			page = req.params.page * 1 || 1,
			per_page = 100;

		page = page > 1 ? page : 1;
		var next = page + 1,
			prev = ( page - 1 > 0 ? page - 1 : false );

		robot.redisclient.lrange( 'logs_' + channel, ( ( page - 1 ) * per_page ) , ( page * per_page ) - 1 , function(err, logs) {
			var log_out = [];
			for( var i = logs.length - 1; i >= 0; i-- ) {
				var _new = JSON.parse( logs[i] );
				_new.stamp = time_ago( _new.stamp );
				if( _new.data.message && !_new.data.parsed )
					_new.data.message = parse_message( _new.data.message );
				_new['is_' + _new.type] = true;
				log_out.push( _new );
			}
			if( log_out.length != per_page ) next = false;
			res.end( log_tmpl.render( { base: req.params.channel, pagination: { page: page, next: next, prev: prev }, title: channel, logs: log_out } ) );
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
		var regex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@\$#\*\/%?=~_|!:,.;]*[-A-Z0-9+&@\$#\/%=~_|])/ig,
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