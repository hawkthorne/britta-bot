# Description:
#   Utility commands surrounding Hubot uptime.
#
# Commands:
#   :ping - Reply with pong
#   :echo <text> - Reply back with <text>
#   :time - Reply with current time

module.exports = (robot) ->
  robot.respond /PING$/i, (msg) ->
    msg.send "PONG"

  robot.respond /ECHO (.*)$/i, (msg) ->
    msg.send msg.match[1]

  robot.respond /TIME$/i, (msg) ->
    msg.send "Server time is: #{new Date()}"
