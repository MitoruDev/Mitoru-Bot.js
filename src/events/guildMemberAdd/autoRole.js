module.exports = async (client) => {
  client.on('guildMemberAdd', async (member, interaction) => {
    try {
      let guild = member.guild;
      if (!guild) return;

      const roleId = '1118098366858014764'; // ID der Autorolle

      // Hier wird die Rolle dem Mitglied zugewiesen
      await member.roles.add(roleId);

    } catch (error) {
      console.log(`Fehler im Event/AutoRole: ${error}`);
    }
  });
};

