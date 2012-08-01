// Description:
//   Changme is the most changtasitc thing in your life
//
// Commands:
//   :chang me - Receive a chang
//   :chang bomb N - get changd N times in the chang ( limit 8 )

module.exports = function(robot) {

	robot.respond( /chang me/i, function(msg) {
		changme( msg, 1 );
	});

	robot.respond( /chang bomb( (\d+))?/i, function(msg) {
		var count = msg.match[2] || 5;
		count = ( count < 10 ? count : 8 );
		changme( msg, count );
	});

	function changme( msg, count ) {
		var page = msg.random( [0,4,8,12] );
		msg
			.http('http://ajax.googleapis.com/ajax/services/search/images')
			.query( { v: '1.0', as_filetype: 'gif',start: page,rsz: '8', q: 'senor chang community', safe: 'active' } )
			.get()(function(err, res, body) {
				var images = (JSON.parse( body )).responseData.results;
				images.sort(function() {return 0.5 - Math.random()});
				for( var c = 0; c < count; c++ ) {
					msg.send( images[c].url );
				}
			});
	}

}
