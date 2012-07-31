// Description:
//   None
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   :insult <name> - give <name> the what-for
//
// Author:
//   ajacksified / jhoff

module.exports = function(robot) {
	robot.respond( /insult (.*)/i, function(msg) {
		name = msg.match[ 1 ].trim();
		msg.send( insult( name ) );
	}
}

var insult = function(name) {
	insults[ ( Math.random() * insults.length ) >> 0 ].replace( /{name}/ , name );
}

var insults = [
	"Hey {name}, Do you mind that your face makeup doesn’t match your neck?",
	"Hey {name}, When I squint, you look like a circus clown.",
	"Hey {name}, We've never met– like your hair and dandruff shampoo.",
	"Hey {name}, Good one. Tell that to the stitch in your ratty panties, or wear higher jeans on laundry day.",
	"{name}, You’re bowlegged."
];