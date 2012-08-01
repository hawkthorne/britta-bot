//Description:
//  Changme is the most changtasitc thing in your life
//
//Commands:
//  :chang me - Receive a chang
//  :chang bomb N - get changd N times in the chang ( limit 8 )
//  :dean me - Receive a dean
//  :dean bomb N - receive N deans to the face ( limit 8 )
//  :jeff me - Receive a jeff
//  :jeff bomb N - N jeffs, all equally handsome ( limit 8 )
//  :annie me - Receive an annie
//  :annie bomb N - N annies, all equally pretentious ( limit 8 )
//  :pierce me - Receive a pierce
//  :pierce bomb N - get a pocketfull of N pierces ( limit 8 )
//  :troy me - Receive a troy
//  :troy bomb N - troy xN ( limit 8 )
//  :shirley me - Receive a shirley
//  :shirley bomb N - N times the shirley fun! ( limit 8 )
//  :abed me - Receive an abed
//  :abed bomb N - get N abeds all in a row ( limit 8 )
//  :britta me - Receive a britta
//  :britta bomb N - get britta'd N times ( limit 8 )

module.exports = function(robot) {

	robot.respond( /chang( me| bomb)?( (\d+))?/i, function(msg) {
		image( '"senor chang"', msg );
	});

	robot.respond( /dean( me| bomb)?( (\d+))?/i, function(msg) {
		image( '"dean pelton"', msg );
	});

	robot.respond( /jeff( me| bomb)?( (\d+))?/i, function(msg) {
		image( '"jeff winger"', msg );
	});

	robot.respond( /annie( me| bomb)?( (\d+))?/i, function(msg) {
		image( '"annie edison"', msg );
	});

	robot.respond( /pierce( me| bomb)?( (\d+))?/i, function(msg) {
		image( '"pierce hawthorne"', msg );
	});

	robot.respond( /troy( me| bomb)?( (\d+))?/i, function(msg) {
		image( '"troy barnes"', msg );
	});

	robot.respond( /shirley( me| bomb)?( (\d+))?/i, function(msg) {
		image( '"shirley bennett"', msg );
	});

	robot.respond( /abed( me| bomb)?( (\d+))?/i, function(msg) {
		image( '"abed nadir"', msg );
	});

	robot.respond( /britta( me| bomb)?( (\d+))?/i, function(msg) {
		image( '"britta perry"', msg );
	});

	function image( character, msg ) {
		var page = (shuffle( [0,4,8,12] ))[0],
			count = 1;

		if( msg.match[1] && msg.match[1].toLowerCase() == ' bomb' )
			count = ( msg.match[3] <= 8 ? msg.match[3] : 8 );

		msg
			.http('http://ajax.googleapis.com/ajax/services/search/images')
			.query( { v: '1.0', start: page,rsz: '8', q: character + ' community', safe: 'active' } )
			.get()(function(err, res, body) {
				var images = (JSON.parse( body )).responseData.results;
				images = shuffle( images );
				for( var c = 0; c < count; c++ ) {
					msg.send( images[c].url );
				}
			});
	}

	function shuffle(array) {
		var tmp, current, top = array.length;

		if(top) while(--top) {
			current = Math.floor(Math.random() * (top + 1));
			tmp = array[current];
			array[current] = array[top];
			array[top] = tmp;
		}

		return array;
	}

}
