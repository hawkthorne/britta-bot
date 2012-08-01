// Description:
//   Deanme is the most flamboyant thing in your life
//
// Commands:
//   :dean me - Receive a dean
//   :dean bomb N - get N deans ( limit 8 )

module.exports = function(robot) {

	robot.respond( /dean me/i, function(msg) {
		deanme( msg, 1 );
	});

	robot.respond( /dean bomb( (\d+))?/i, function(msg) {
		var count = msg.match[2] || 5;
		count = ( count < 10 ? count : 8 );
		deanme( msg, count );
	});

	function deanme( msg, count ) {
		var page = msg.random( [0,4,8,12] );
		msg
			.http('http://ajax.googleapis.com/ajax/services/search/images')
			.query( { v: '1.0', as_filetype: 'gif', start: page, rsz: '8', q: 'dean pelton community', safe: 'active' } )
			.get()(function(err, res, body) {
				var images = (JSON.parse( body )).responseData.results;
				images.sort(function() {return 0.5 - Math.random()});
				for( var c = 0; c < count; c++ ) {
					msg.send( images[c].url );
				}
			});
	}

}