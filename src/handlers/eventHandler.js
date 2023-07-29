
  
const path = require('path');
const getAllFiles = require('../utils/getAllFiles');
const { addXP } = require('../events/xpSystem/onMessage.js');


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
  
  //Button
  const verifyButton = require('../events/interactionButton/verifyButton.js');
  const ticketButton = require('../events/interactionButton/ticketButton.js');
  const voteSystem = require('../events/interactionButton/voteButton.js');
  const joinToCreateButton = require('../events/interactionButton/joinToCreateButton.js');
  client.on('interactionCreate', (interaction) => {
    if (interaction.isButton()) {
      if (interaction.customId  == '1112701047362834479'){
        verifyButton(client, interaction);
      } else if (interaction.customId == 'createticket'){
        ticketButton(client, interaction);
      } else if (interaction.customId.startsWith("ticket-")) {
        ticketButton(client, interaction);
      } else if (interaction.customId.startsWith("vote")) {
        voteSystem(client, interaction);
      } else if (interaction.customId.startsWith("joinToCreate")) {
        joinToCreateButton(client, interaction);
      } else {
        interaction.reply({
          content: `Interaktion konnte nicht zugeordnet werden`,
          ephemeral: true,
        });
      }
    }
  });

  // Auto-Role
  const autorole = require('../events/guildMemberAdd/autoRole.js');
  autorole(client);

  // Member-Count
  const memberCountHandler = require('../events/guildMemberAdd/memberCount.js');
  memberCountHandler(client);

  // Welcome Message
  const welcomeMessage = require('../events/guildMemberAdd/welcomeMessage.js');
  welcomeMessage(client);

  // Join-To-Create 
  const joinToCreate = require('../events/guildMemberAdd/joinToCreate.js');
  joinToCreate(client);

  // Level-System
  const xpSystem = require('../events/xpSystem/onMessage.js');
  xpSystem(client);

}
