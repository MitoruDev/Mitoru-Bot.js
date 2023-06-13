const { ActivityType } = require('discord.js');

module.exports = (client) => {
  let status = [
    {
      name: ": The 1% Journey ♠",
      type: ActivityType.WATCHING,
    },
    {
      name: ": /help - The 1% Journey ♠",
      type: ActivityType.PLAYING,
    },
  ];

  setInterval(() => {
    let random = Math.floor(Math.random() * status.length);
    client.user.setActivity(status[random]);
  }, 20000);
};