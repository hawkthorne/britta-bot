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
//  :chang me - Let the changlarity ensue...
//
//Author:
//  ajacksified / jhoff

module.exports = function(robot) {
	robot.respond( /chang/i, function(msg) {
		msg.send( changs[ ( Math.random() * changs.length ) >> 0 ] );
	});
}

var changs = [
//quotes
	"Thank you, sir. You won't regret this unless I rise up against you.",
	"I swear, they're just for sex!",
	"Don't tell the monkey I'm living in here.",
	"Does anyone have an alliance I can join? I'm really loyal.",
	"Don't shoot me, shoot him! He's white and out of ammo.",
	"I never told you this, but Changs are usually born with tails. You, sort of dodged a bullet there.",
	"My nephew Jim was born on the treadmill at Bally Total Fitness; 20% incline.",
	"Chang babies love the sauce, you know? Alcohol AND Duck.",
	"Trust me I know these vents like the back of my Chang.",
	"Why do I have to put the VCR on 3, if Bones is on 5?",
	"Between you and me, I don't Chang a lot of chicks.",
	"Landline? Ok, Grandma Bell.",
	"I can answer both of those questions by returning your driver's license.",
	"Are you ignoring me because I'm Korean?",
	"You're racist! Just been proven racist by the racist prover.",
	"I will find a loophole...then I'll kill you.",
	"So I did what any man would do. I faked my way into a job teaching Spanish at a community college using phrases from Sesame Street.",
	"Looks like the law from of Slumdog and Seacrest is taking the day off.",
	"I am a man who can never die! And this has been your first taste of Spanish one-oh-dos, the semester I get inside your cabezas.",
	"You make no mistake about this, Winger. I pleasured that woman greatly.",
	"Pickled bull testicle?",
	"Give it up, Winger. Professor Slater doesn't date students... or married asians that drive mopeds",
	"Come on, hands people! It's 90% of Spanish",
// images
	"http://collider.com/wp-content/uploads/community-chang-propaganda-poster.jpg",
	"http://images3.cliqueclack.com/tv/wp-content/uploads/2010/05/community-chang-425x239.jpg",
	"http://25.media.tumblr.com/tumblr_lwo6vsTfRv1qd7ovlo1_400.jpg",
	"http://24.media.tumblr.com/tumblr_lwmzcveo951qd6zubo1_500.jpg",
	"http://www2.macleans.ca/wp-content/uploads/2011/03/community-chang1.jpg",
	"http://images.starpulse.com/Photos/Previews/Community-tv-29.jpg",
	"http://25.media.tumblr.com/tumblr_l2gtixlr9z1qz82gvo1_500.jpg",
	"http://a1.s6img.com/cdn/box_004/post_14/501743_5906547_b.jpg",
// animated gifs
	"http://media.tumblr.com/tumblr_lwl8umfhJT1qzlqgx.gif",
	"http://media.tumblr.com/tumblr_lwl8w9z0xu1qzlqgx.gif",
	"http://media.tumblr.com/tumblr_lwl8x3NUZ31qzlqgx.gif",
	"http://media.tumblr.com/tumblr_lwl8tkYG4Y1qzlqgx.gif",
	"http://media.tumblr.com/tumblr_lwl8u63E5z1qzlqgx.gif",
	"http://media.tumblr.com/tumblr_lwl8wsr81O1qzlqgx.gif",
	"http://media.tumblr.com/tumblr_lwl8vzek4X1qzlqgx.gif",
	"http://media.tumblr.com/tumblr_lwl8t6K3vh1qzlqgx.gif",
	"http://media.tumblr.com/tumblr_lwl8xmR3yF1qzlqgx.gif",
	"http://media.tumblr.com/tumblr_lwl8yg1ioF1qzlqgx.gif",
	"http://media.tumblr.com/tumblr_lwl8y1aTjQ1qzlqgx.gif",
	"http://media.tumblr.com/tumblr_lwl8zgeWvD1qzlqgx.gif",
	"http://cdn2.screenjunkies.com/wp-content/uploads/2011/03/change-elf-community.gif",
	"http://images5.fanpop.com/image/photos/29900000/Chang-community-29955490-500-250.gif"
];
