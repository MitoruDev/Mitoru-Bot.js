const {
  ApplicationCommandOptionType,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const EmbedBuilderUtil = require("../../utils/embedBuilder");

module.exports = {
  deleted: false,
  name: "close-vote",
  description: "Der Bot schließt ein vorhandenes Ticket.",
  // devOnly: Boolean,
  // testOnly: Boolean,
  options: [
    {
        name: 'title',
        description: 'Titel der Embed Nachricht',
        type: ApplicationCommandOptionType.String,
        required: true,
    }
  ],
  permissionsRequired: [PermissionsBitField.Flags.ManageRoles],
  botPermissions: [PermissionsBitField.Flags.ManageRoles],

  callback: async (client, interaction) => {
    
    try {
      await interaction.reply({
        content: "Dieser Befehl ist derzeit noch in Wartung. ⚙",
        ephemeral: true,
      });
      
    } catch (error) {
      console.error("Fehler beim Antworten auf den Befehl:", error);
    }
  },
};
  