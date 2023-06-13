const path = require('path');
const autorole = require('../events/guildMemberAdd/autoRole.js');
const getAllFiles = require('../utils/getAllFiles');

module.exports = (client) => {
  const eventFolders = getAllFiles(path.join(__dirname, '..', 'events'), true);

  for (const eventFolder of eventFolders) {
    let eventFiles = getAllFiles(eventFolder);
    eventFiles.sort();

    const eventName = eventFolder.replace(/\\/g, '/').split('/').pop();

    client.on(eventName, async (arg) => {
      for (const eventFile of eventFiles) {
        const eventFunction = require(eventFile);
        await eventFunction(client, arg);
      }
    });
  }
  
  // Button-Handler registrieren
  const buttonHandler = require('../events/interactionButton/verifyButton.js');
  client.on('interactionCreate', (interaction) => {
    if (interaction.isButton()) {
      buttonHandler(client, interaction);
    }
  });

  //Guild Member hinzufügen Event-Handler
  const guildMemberAddHandler = require('../events/guildMemberAdd/autoRole.js');
  guildMemberAddHandler(client);


  // Füge den folgenden Code hinzu, um die memberCount.js-Datei einzubinden
  const memberCountHandler = require('../events/guildMemberAdd/memberCount.js');
  memberCountHandler(client);
};

  
