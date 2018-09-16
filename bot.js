var config = require('./config.json');

var bot = new Discord.Client({
  token: config.auth.token,
  autorun: true
});

module.exports = bot
