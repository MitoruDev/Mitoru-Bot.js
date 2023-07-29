const config = require("../../../config.json");

module.exports = async (client) => {
  const memberCountChannelId = "1112701048763727923"; // ID des Kanals, in dem die Mitgliederzahl angezeigt werden soll
  const botCountChannelId = "1112701048763727924"; // ID des Kanals, in dem die Bot-Anzahl angezeigt werden soll

  const updateMemberCount = (guild) => {
    const memberCountChannel = guild.channels.cache.get(memberCountChannelId);
    const botCountChannel = guild.channels.cache.get(botCountChannelId);
    
    if (memberCountChannel && botCountChannel) {
      const memberCount = guild.memberCount;
      const botCount = guild.members.cache.filter(member => member.user.bot).size;
      
      memberCountChannel.setName(`⭐｜Mitglieder: ${memberCount}`);
      botCountChannel.setName(`🤖｜Bots: ${botCount}`);
    }
  };

  client.on("guildMemberAdd", (member) => {
    updateMemberCount(member.guild);
  });

  client.on("guildMemberRemove", (member) => {
    updateMemberCount(member.guild);
    
  });
};
