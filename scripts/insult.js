//Description:
//  None
//
//Dependencies:
//  None
//
//Configuration:
//  None
//
//Commands:
//  :insult <name> - give <name> the what-for
//
//Author:
//  ajacksified / jhoff

module.exports = function(robot) {
	robot.respond( /insult (.*)/i, function(msg) {
		var name = msg.match[ 1 ].trim(),
			namelc = name.toLowerCase();
		if( namelc == "yourself" || namelc == "you" || namelc == robot.name || namelc == 'me' ) name = msg.message.user.name;
		msg.send( insult( name ) );
	});
}

var insult = function(name) {
	return insults[ ( Math.random() * insults.length ) >> 0 ].replace( /{name}/ , name );
}

var insults = [
	"{name}, Do you mind that your face makeup doesn’t match your neck?",
	"{name}, When I squint, you look like a circus clown.",
	"{name}, We've never met– like your hair and dandruff shampoo.",
	"{name}, Good one. Tell that to the stitch in your ratty panties, or wear higher jeans on laundry day.",
	"{name}, You’re bowlegged.",
	"{name}, You're the opposite of Batman.",
	"{name}, You're the AT&T of people!",
	"{name}, You're a holocaust-denying 9/11 pedophile.",
	"{name}, Looks like someone woke up on the regular side of the bed.",
	"{name}, YOU'RE THE WORST!",
	"{name}, Tell your disappointment to suck it.",
	"{name}, You're more like Michael Douglas in any of his movies.",
	"{name}, Oh yeah, well you have Aspergers.",
	"SCHMITTAY!!!",
	"Duh Doi!!!",
	"{name}, You britta'd it.",
	"{name}, A six year old girl could talk to you that way.",
	"{name}, You're the center slice of a square cheese pizza. Actually, that sounds delicious. I'm the center slice of a square cheese pizza – you're Jim Belushi.",
	"{name}, I'll make your ass sense.",
	"{name}, You're a pizza burn on the roof of the world's mouth!",
	"{name}, You need to check that attitude at the door.",
	"You need to check the door before you go through it, {name}.",
	"I can tell life from TV, {name}. TV makes sense, it has structure, logic, rules and likeable leading men. In life we have this. We have you.",
	"Knock, Knock. Who's there? Cancer. Oh good, come in. I thought it was {name}.",
	"{name}, Ha.... GAYYYYYYYYYYYYYYYY",
	"{name}, You non-miraculous bastard",
	"Shut up {name}! I know about your prescription socks!",
	"Shut up {name}! I know about your crooked wang!",
	"{name} is equal parts Hanson and Manson.",
	"{name}, I'm gonna slit your butt's throats!",
	"Shut up {name}. No one even knows what you're talking about.",
	"{name}, When we met I thought you were smarter than me.",
	"{name}, What are you? A north korean seamstress?",
	"{name}, With all due respect sir, I have zero respect for you.",
	"{name}, You're just a good grade in a tight sweater.",
	"{name}, You're a fun vampire. You don't suck blood, you just suck.",
	"{name} is just a mess. It's like God spilled a person.",
	"Hey {name}, Enjoy eating fiber and watching The Mentalist.",
	"{name}, You are human tennis elbow!",
	"{name}, going home alone? GAY!",
	"{name}, If you have to ask, you're streets behind."
];