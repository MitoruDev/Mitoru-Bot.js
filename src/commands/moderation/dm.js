const {
    ApplicationCommandOptionType,
    PermissionsBitField,
  } = require("discord.js");
  const EmbedBuilderUtil = require("../../utils/embedBuilder");
  
  module.exports = {
    deleted: false,
    name: "dm",
    description: "Der Bot versendet eine benutzerdefinierte Nachricht an einen Nutzer",
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
      {
        name: 'title',
        description: 'Titel der Embed Nachricht',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
  
      {
        name: 'description',
        description: 'Beschreibung der Embed Nachricht',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
  
      {
        name: "user",
        description: "Die ID-Nr. für den Action-Row Button",
        type: ApplicationCommandOptionType.User,
        required: true,
      }
    ],
    permissionsRequired: [PermissionsBitField.Flags.ManageRoles],
    botPermissions: [PermissionsBitField.Flags.ManageRoles],
  
    callback: async (client, interaction) => {
      const title = interaction.options.getString("title");
      const description = interaction.options.getString("description");
      const user = interaction.options.getUser("user");
  
      const body = interaction.options
        .getString("description")
        .replace(/\\n/g, "\n");
  
      try {
        const embed = EmbedBuilderUtil.createBasicEmbed(
          title,
          body
        );

        await interaction.reply({
            content: "Nachricht erfolgreich versendet!",
            ephemeral: true,
          });

        await user.send({ embeds: [embed] });
  
      } catch (error) {
        console.error("Fehler beim Antworten auf den Befehl:", error);
      }
    },
  };
  