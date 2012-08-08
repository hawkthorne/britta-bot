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
				write_log(
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
				write_log(
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
				write_log(
					'errors',
					type,
					{
						message: args[0]
					}
				);
				break;
			case 'join':
				// channel, who
				write_log(
					args[0],
					type,
					{
						user: args[1]
					}
				);
				break;
			case 'part':
				// channel, who, reason
				write_log(
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
					write_log(
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
					write_log(
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
				write_log( log.room, log.type, log.data );
		},
		1000
	);

	function write_log( room, type, data ) {
		room = room.trim();
		console.log(type + ': pushing', data, 'to logs_' + room);
		robot.redisclient.lpush( 'logs_' + room, JSON.stringify( {
			type: type,
			stamp: Math.floor((new Date()).getTime() / 1000),
			data: data
		} ) );
		robot.redisclient.ltrim( 'logs_' + room, 0, 1000 );
	}
//	process.hubot = robot;
}