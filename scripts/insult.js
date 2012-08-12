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
//  :insult bomb <name> - put <name> in a body bag
//
//Author:
//  ajacksified / jhoff

module.exports = function(robot) {
	robot.respond( /insult (.*)/i, function(msg) {
		var name = msg.match[ 1 ].trim(),
			namelc = name.toLowerCase();
		if( !namelc.match( /^bomb.*/i ) ) {
			if( [ 'yourself', 'you', robot.name, 'me' ].indexOf( namelc ) >= 0 ) name = msg.message.user.name;
			insult( msg, name, 1 );
		}
	});

	robot.respond( /insult bomb (.*)/i, function(msg) {
		var name = msg.match[ 1 ].trim(),
			namelc = name.toLowerCase();
		if( [ 'yourself', 'you', robot.name, 'me' ].indexOf( namelc ) >= 0 ) name = msg.message.user.name;
		insult( msg, name, 10 );
	});
}

var insult = function( msg, name, count ) {
	var rand_insults = shuffle( insults );
	for( var i = 0; i < count; i++ ) {
		msg.send( rand_insults.pop().replace( /{name}/ , name ) );
	}
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
	"Oh yeah {name}? Well you have Aspergers.",
	"I never thought you were cool, I just thought you were a lesbian.",
	"SCHMITTAY!!!",
	"Duh Doi!!!",
	"{name}, You britta'd it.",
	"{name}, A six year old girl could talk to you that way.",
	"{name}, You're the center slice of a square cheese pizza. Actually, that sounds delicious. I'm the center slice of a square cheese pizza – you're Jim Belushi.",
	"{name}, I'll make your ass sense.",
	"You're average, {name}; you're every kid on the playground that didn't get picked on. You're a business-casual potted plant, a human whitesale. You're VH1, Robocop 2, Back to the Future 3.",
	"{name}, You're a pizza burn on the roof of the world's mouth!",
	"{name}, You need to check that attitude at the door.",
	"You need to check the door before you go through it, {name}.",
	"I can tell life from TV, {name}. TV makes sense, it has structure, logic, rules and likeable leading men. In life we have this. We have you.",
	"Knock, Knock. Who's there? Cancer. Oh good, come in. I thought it was {name}.",
	"{name}, Ha.... GAYYYYYYYYYYYYYYYY",
	"{name}, You non-miraculous son of a bitch",
	"Shut up {name}! I know about your prescription socks!",
	"Shut up {name}! I know about your crooked wang!",
	"Shut up {name}! I talked to your son on family day. I know all about your gambling.",
	"{name} is equal parts Hanson and Manson.",
	"{name}, I'm gonna slit your butt's throats!",
	"Shut up {name}. No one even knows what you're talking about.",
	"Look at your face! It's like your mom was a lizard, who got raped by a muppet.",
	"You look like a toddler who go dressed in the dark.",
	"{name}, you seemed smarter when I met you.",
	"{name}, What are you? A north korean seamstress?",
	"{name}, With all due respect sir, I have zero respect for you.",
	"{name}, You're just a good grade in a tight sweater.",
	"{name}, You're just a bad grade in a tight sweater.",
	"{name}, You're a fun vampire. You don't suck blood, you just suck.",
	"{name} is just a mess. It's like God spilled a person.",
	"For my turn, I feel sorry for {name}.",
	"In about 13 turns, {name} will die of exposure. I wait 14 turns.",
	"Hey {name}, Enjoy eating fiber and watching The Mentalist.",
	"{name}, You are human tennis elbow!",
	"{name}, going home alone? GAY!",
	"{name}, If you have to ask, you're streets behind.",
	"{name}, Stifle your slackened maw you drained and tainted bitch dog.",
	"{name}, You're just an average-looking guy with a big chin.",
	"{name}, You're streets behind.",
	"{name}, Your team's Al Gore because your views are wrong.",
	"{name}, You're like the exact opposite of an anti-oxidant.",
	"{name}, Your feet are long and stupid.",
	"{name}, Life sued you and you lost.",
	"{name}, You're a bad rowboat, someone should sink you.",
	"{name}, You are a puff of hot air from the lips of a ghost in the shadow of a unicorn's dream.",
	"{name}, Your love is weird, and toxic, and it destroys everything it touches!",
	"{name}, Shouldn't you be making weird art movies or well-engineered cars?",
	"{name}, If you get any nuttier, they're going to put you on The View.",
	"{name}, You're crazytown banana pants.",
	"{name}, Your name might as well be Gravy Jones.",
	"{name}, Your demographic's historical vanity is well-documented!",
	"{name}, You look like a pizza guy who couldn't make it into porn.",
	"{name}, You're a monster, you're Hitler, you're a racist pedophile!",
	"{name}, If you had let being bad at something stop you, you wouldn't be here.",
	"{name}, It must be hard to find someone willing to stomach your imminent dementia and present incontinence.",
	"{name}, I've always thought you were a joke and this isn't disproving the theory.",
	"{name}, If a mechanical spider was tearing you to pieces, Tom Selleck would just stand there and watch you die.",
	"{name}, You're no more of a song writer than Billy Joel.",
	"{name} is a GDB.",
	"{name}, Go tongue Chang.",
	"{name}, I thought you were like Bill Murray in any of his films, but you're more like Michael Douglas in any of his films.",
	"{name}, I hope you transfer to hell.",
	"{name}, You're an embarrassment to the department."
];