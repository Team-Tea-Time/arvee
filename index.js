var Discord = require('discord.io');
var express = require('express');
var bodyParser = require('body-parser');
var CommandHandler = require('./CommandHandler');
var APIHandler = require('./APIHandler');
var config = require('./config.json');

var bot = new Discord.Client({
  token: config.auth.token,
  autorun: true
});

bot.on('ready', function () {
  console.log('Logged in as %s - %s\n', bot.username, bot.id);
});

bot.on('message', function (user, userID, channelID, message, event) {
  if (message.substring(0, 1) == '!') {
    let handler = new CommandHandler(config);
    let args = message.substring(1).split(' ');
    let cmd = args[0];
    args = args.splice(1);

    if (typeof handler[cmd] === "function") { 
      handler[cmd](args)
        .then(message => {
          bot.sendMessage({
            to: channelID,
            message
          });
        })
        .catch(error => {
          bot.sendMessage({
            to: channelID,
            message: `Error: ${error.message}`
          });
        });
    }
  }
});

var app = express();

app.use(bodyParser.json());

let api = new APIHandler(bot);
app.post('/news', api.news);

app.listen(6500, () => console.log('API listening on port 6500'));
