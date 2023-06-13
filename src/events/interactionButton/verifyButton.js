module.exports = async (client, interaction) => {
    if (interaction.isButton()) {
      try {
        const clickedButtonId = interaction.customId;
        if (clickedButtonId === '1112701047362834479') { // Hier die Button-ID einfügen
          const roleId = '1112701047362834479'; // Hier die Rollen-ID einfügen
          const member = interaction.member;
          const role = interaction.guild.roles.cache.get(roleId);
          if (role) {
            await interaction.reply({
              content: "Du hast dich erfolgreich verifiziert!",
              ephemeral: true,
            });
            await member.roles.add(role);
            await member.roles.remove('1118098366858014764');
          } else {
            console.log("Rolle nicht gefunden");
          }
        }
      } catch (error) {
        console.error("Fehler beim Verarbeiten des Button-Klicks:", error);
      }
    }
  };
  