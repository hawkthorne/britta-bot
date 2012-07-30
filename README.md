# Britta-bot

Britta bot is an instance of Github's hubot for the #Hawkthorne channel on irc.freenode.net

## Usage

All commands to britta-bot can be prefixed with ':'

	:<user> is a badass guitarist - assign a role to a user
	:<user> is not a badass guitarist - remove a role from a user
	:animate me <query> - The same thing as `image me`, except adds a few parameters to try to return an animated GIF instead.
	:convert me <expression> to <units> - Convert expression to given units.
	:echo <text> - Reply back with <text>
	:help - Displays all of the help commands that britta-bot knows about.
	:help <query> - Displays all help commands that match <query>.
	:image me <query> - The Original. Queries Google Images for <query> and returns a random top result.
	:map me <query> - Returns a map view of the area returned by `query`.
	:math me <expression> - Calculate the given expression.
	:mustache me <query> - Searches Google Images for the specified query and mustaches it.
	:mustache me <url> - Adds a mustache to the specified URL.
	:ping - Reply with pong
	:pug bomb N - get N pugs
	:pug me - Receive a pug
	:quote - Displays a random quote from Community!.
	:show storage - Display the contents that are persisted in the brain
	:show users - Display all users that britta-bot knows about
	:the rules - Make sure britta-bot still knows the rules.
	:time - Reply with current time
	:translate me <phrase> - Searches for a translation for the <phrase> and then prints that bad boy out.
	:translate me from <source> into <target> <phrase> - Translates <phrase> from <source> into <target>. Both <source> and <target> are optional
	:who is <user> - see what roles a user has
	:youtube me <query> - Searches YouTube for the query and returns the video embed link.