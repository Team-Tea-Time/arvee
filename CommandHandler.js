var https = require('https');

class CommandHandler {
  constructor(config) {
    this.config = config;
  }

  status (args) {
    return new Promise((resolve, reject) => {
      https.get(`https://api.nwn.beamdog.net/v1/servers/${this.config.nwn.ip}/${this.config.nwn.port}`, resp => {
        let data = '';
  
        resp.on('data', (chunk) => {
          data += chunk;
        });
  
        resp.on('end', () => {
          const status = JSON.parse(data);
  
          if (status.module_name) {
            const playerCount = parseInt(status.current_players);
            const playerCountSegment = playerCount == 1 ? `is **1 player**` : `are **${playerCount} players**`;
  
            resolve(`The server is currently **online**. It's running **${status.module_name}** and there ${playerCountSegment} in-game.`);
          } else {
            resolve("The server appears to be **offline**.");
          }
        });
      }).on('error', (error) => {
        console.error(error.message);
        reject(error);
      });
    });
  }
}

module.exports = CommandHandler;
