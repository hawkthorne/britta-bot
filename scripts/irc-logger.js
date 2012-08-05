//Description:
//  Logs events to redis
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
	robot.enter( function(msg) {
		if( msg.message.user.name != robot.name ) {
			write_message( 'join', msg );
		}
	});
	robot.leave( function(msg) {
		if( msg.message.user.name != robot.name ) {
			write_message( 'part', msg );
		}
	});
	robot.catchAll( function(msg) {
		write_message( 'text', msg );
	});
	robot.adapter.bot.on('nick',function( oldnick, newnick, channels ) {
		for( var i in channels ) {
			write_log(
				channels[i],
				'nick',
				{
					from: oldnick,
					to: newnick
				}
			);
		}
	});

	function write_message( type, msg ) {
		_room = msg.message.user.room;
		_msg = { user: msg.message.user.name };
		if( type == 'text' ) {
			_msg.text = msg.message.text;
		}
		write_log( _room, type, _msg );
	}

	function write_log( room, type, data ) {
		room = room.trim();
		console.log('pushing', data, 'to logs_' + room);
		robot.redisclient.lpush( 'logs_' + room, JSON.stringify( {
			type: type,
			stamp: Math.floor((new Date()).getTime() / 1000),
			data: data
		} ) );
		robot.redisclient.ltrim( 'logs_' + room, 0, 1000 );
	}
//	process.hubot = robot;
}