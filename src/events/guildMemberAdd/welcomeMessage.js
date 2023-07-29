const EmbedBuilderUtil = require("../../utils/embedBuilder");

module.exports = async (client) => {
    client.on('guildMemberAdd', async (member) => {
      try {
        memberid = member.id;
        const guildMember = client.guilds.cache.first().members.cache.get(memberid);
        const welcomeChannel = client.channels.cache.get('1112701048763727928');
        
        const embed = EmbedBuilderUtil.createBasicEmbed(
            "Ein neuer Nutzer ist dem Discord Server beigetreten",
            `${guildMember} Willkommen auf dem 1% Journey Discords Server`
          );
      
        await welcomeChannel.send({ embeds: [embed] });

  
      } catch (error) {
        console.log(`Fehler im Event/welcomeMessage: ${error}`);
      }
    });
  };
  