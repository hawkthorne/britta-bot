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
//Author:
//  jhoff

module.exports = function(robot) {

	var queue = [];

	// listen for all events that the irc bot emits
	robot.adapter.bot
		.on( 'kick',		function() { emit_listener( 'kick',			arguments ); } )
		.on( 'message',		function() { emit_listener( 'message',		arguments ); } )
		.on( 'error',		function() { emit_listener( 'error',		arguments ); } )
		.on( 'join',		function() { emit_listener( 'join',			arguments ); } )
		.on( 'part',		function() { emit_listener( 'part',			arguments ); } )
		.on( 'quit',		function() { emit_listener( 'quit',			arguments ); } )
		.on( 'nick',		function() { emit_listener( 'nick',			arguments ); } )
		.on( 'selfMessage',	function() { emit_listener( 'selfMessage',	arguments ); } );

	function emit_listener( type, args ) {
		switch( type ) {
			case 'kick':
				// channel, who, by, reason
				prepare_log(
					args[0],
					type,
					{
						user: args[1],
						by: args[2],
						reason: args[3]
					}
				);
				break;
			case 'message':
				// from, channel, text
				prepare_log(
					args[1],
					type,
					{
						user: args[0],
						message: args[2]
					}
				);
				break;
			case 'selfMessage':
				// to, text
				if( args[0].indexOf('#') == 0 ) {
					// delay logging selfMessage, since they are buffered on irc
					queue.push({
						room: args[0],
						type: 'message',
						data: {
							user: robot.name,
							message: args[1]
						}
					});
				}
				break;
			case 'error':
				// message
				prepare_log(
					'errors',
					type,
					{
						message: args[0]
					}
				);
				break;
			case 'join':
				// channel, who
				prepare_log(
					args[0],
					type,
					{
						user: args[1]
					}
				);
				break;
			case 'part':
				// channel, who, reason
				prepare_log(
					args[0],
					type,
					{
						user: args[1],
						reason: args[2]
					}
				);
				break;
			case 'quit':
				// who, reason, channels
				for( var i in args[2] ) {
					prepare_log(
						args[2][i],
						type,
						{
							user: args[0],
							reason: args[1]
						}
					);
				}
				break;
			case 'nick':
				// old nick, new nick, channels
				for( var i in args[2] ) {
					prepare_log(
						args[2][i],
						type,
						{
							from: args[0],
							to: args[1]
						}
					);
				}
				break;
		}
	}

	setInterval(
		function() {
			var log;
			if( log = queue.shift() )
				prepare_log( log.room, log.type, log.data );
		},
		1000
	);

	function prepare_log( room, type, data ) {
		var stamp = Math.floor((new Date()).getTime() / 1000);
		room = room.trim();
		if( data.message ) {
			if( process.env.EMBEDLY_KEY ) {
				var embedly = require('embedly'),
					Api = embedly.Api,
					api = new Api({user_agent: 'Mozilla/5.0 (compatible; myapp/1.0; u@my.com)', key: process.env.EMBEDLY_KEY});

				// get the urls from the message
				urls = parse_message( data.message, true )
				for( var i in urls )
					data.message = data.message.replace( urls[i], '<a href="' + urls[i] + '">' + urls[i] + '</a>' );

				// we have urls in the message
				if( urls && urls.length > 0 ) {
					// send an api request to embedly, on return write to log
					api.oembed(
						{
							urls: urls,
							maxheight: 150,
							wmode: 'transparent',
							method: 'after',
						}
					).on('complete', function(objs) {
						// for each object returned:
						// 		if it is a link, build and append
						// 		if it has html, append it
						// 		if it is of type photo, build and append
						// 		else, do nothing.
						var images_html = '',
							unhandled = [];

						for( var i in objs ) {
							if( objs[i].type == 'link' ) {
								images_html += '<div class="link">\
													<a href="' + objs[i].url + '" class="thumb">\
														<img src="' + objs[i].thumbnail_url + '">\
													</a>\
													<a href="' + objs[i].url + '" class="title">\
														' + objs[i].title + '\
													</a>\
													' + objs[i].description + '\
												</div>';
							} else if( objs[i].html ) {
								images_html += objs[i].html;
							} else if( objs[i].type && objs[i].type == 'photo' ) {
								images_html += '<a href="' + objs[i].url + '" target="_blank">\
													<img src="' + objs[i].url + '">\
												</a>';
							} else {
								unhandled.push( objs[i] );
							}
						}

						if( images_html != '' )
							data.message += "<div class=\"images\">" + images_html + "</div>";

						if( unhandled.length > 0 )
							data.embedly_unhandled = unhandled;

						data.parsed = true;
						write_log( room, type, data, stamp );

					}).on('error', function(e) {
						data.embedly_error = e;
						data.parsed = true;
						write_log( room, type, data, stamp );
					}).start()
				} else {
					write_log( room, type, data, stamp );
				}
			} else {
				// no embedly support, just simple parse and write
				data.message = parse_message( data.message );
				data.parsed = true;
				write_log( room, type, data, stamp );
			}
		} else {
			// no message to parse anyways
			write_log( room, type, data, stamp );
		}
	}

	function write_log( room, type, data, stamp ) {
		//only write if not a PM to the robot itself.
		if( room != robot.name ) {
			room = room.toLowerCase();
			robot.redisclient.lpush( 'logs_' + room, JSON.stringify( {
				type: type,
				stamp: stamp,
				data: data
			} ) );
			robot.redisclient.ltrim( 'logs_' + room, 0, 100000 );
		}
	}

	function parse_message( message, matches_only ) {
		matches_only = matches_only || false;
		var regex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@\$#\*\/%?=~_|!:,.;]*[-A-Z0-9+&@\$#\/%=~_|])/ig,
			matches = message.match( regex ),
			images = '';
		if( matches_only ) {
			return matches;
		} else {
			for( var i in matches ) {
				if( matches[i].match( /\.(jpe?g|gif|png)$/i ) )
					images += "<a href=\"" + matches[i] + "\" target=\"_blank\"><img src=\"" + matches[i] + "\"></a>";
			}
			if( images ) images = "<div class=\"images\">" + images + "</div>";
			return message.replace( regex, "<a href=\"$1\">$1</a>" ) + images;
		}
	}

}