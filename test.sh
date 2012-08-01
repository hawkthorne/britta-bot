#!/bin/sh

PORT="5000" \
HUBOT_IRC_DEBUG="true" \
HUBOT_IRC_NICK="britta-bot-dev" \
HUBOT_IRC_ROOMS="#hawkthorne-test" \
HUBOT_IRC_SERVER="irc.freenode.net" \
HUBOT_IRC_UNFLOOD="true" \
bin/hubot -a irc -n britta-bot --alias ':'