# Description:
#   Utility commands surrounding Hubot uptime.
#
# Commands:
#   None

module.exports = (robot) ->
  robot.respond /PING$/i, (msg) ->
    msg.send "PONG"

  robot.respond /ECHO (.*)$/i, (msg) ->
    msg.send msg.match[1]

  robot.respond /SAY ([A-Z0-9\-\.\#]+) (.*)$/i, (msg) ->
    robot.send msg.match[1], msg.match[2]

  robot.respond /TIME$/i, (msg) ->
    msg.send "Server time is: #{new Date()}"
