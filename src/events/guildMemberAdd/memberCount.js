const config = require("../../../config.json");

module.exports = async (client) => {
    const channelId = "1112701048763727923"; // ID des Channels, in dem der Member Count angezeigt werden soll
  
    const updateMemberCount = async (guild) => {
      const memberCount = guild.memberCount;
      const channel = guild.channels.cache.get(channelId);
      
      if (!channel || channel.type !== 'text') return;
  
      channel.setName(`⭐｜Members: ${memberCount}`);
    };
  
    client.on('guildMemberAdd', async (member) => {
      const guild = member.guild;
      await updateMemberCount(guild);
    });
  
    client.on('guildMemberRemove', async (member) => {
      const guild = member.guild;
      await updateMemberCount(guild);
    });
  };
  