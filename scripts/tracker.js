var Mixpanel = require('mixpanel');

var mixpanel = Mixpanel.init(process.env.MIXPANEL || '');

function getClientIp(req) {
  var ipAddress;
  // Amazon EC2 / Heroku workaround to get real client IP
  var forwardedIpsStr = req.header('x-forwarded-for'); 
  if (forwardedIpsStr) {
    // 'x-forwarded-for' header may return multiple IP addresses in
    // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
    // the first one
    var forwardedIps = forwardedIpsStr.split(',');
    ipAddress = forwardedIps[0];
  }
  if (!ipAddress) {
    // Ensure getting client IP address still works in
    // development environment
    ipAddress = req.connection.remoteAddress;
  }
  return ipAddress;
};

module.exports = function(robot) {

  robot.router.get( "/tracker", function(req, res) {
    mixpanel.track("game-launch", {
      distinct_id: getClientIp(req)
    });
    res.end("It's a a thought... with another thought's hat on.");
  });

};
