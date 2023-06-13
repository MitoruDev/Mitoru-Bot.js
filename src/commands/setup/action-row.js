const {
  ApplicationCommandOptionType,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  deleted: false,
  name: "action-row",
  description: "Der Bot versendet eine benutzerdefinierte Nachricht",
  // devOnly: Boolean,
  // testOnly: Boolean,
  options: [
    {
      name: "id1",
      description: "Die ID-Nr. für den Action-Row Button",
      type: ApplicationCommandOptionType.String,
      required: true,
    },

    {
      name: "label1",
      description: "Das Label für den Action-Row Button",
      type: ApplicationCommandOptionType.String,
      required: true,
    },

    {
      name: "id2",
      description: "Die ID-Nr. für den Action-Row Button",
      type: ApplicationCommandOptionType.String,
      required: false,
    },

    {
      name: "label2",
      description: "Das Label für den Action-Row Button",
      type: ApplicationCommandOptionType.String,
      required: false,
    },

    {
      name: "id3",
      description: "Die ID-Nr. für den Action-Row Button",
      type: ApplicationCommandOptionType.String,
      required: false,
    },

    {
      name: "label3",
      description: "Das Label für den Action-Row Button",
      type: ApplicationCommandOptionType.String,
      required: false,
    },

    {
      name: "id4",
      description: "Die ID-Nr. für den Action-Row Button",
      type: ApplicationCommandOptionType.String,
      required: false,
    },

    {
      name: "label4",
      description: "Das Label für den Action-Row Button",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  permissionsRequired: [PermissionsBitField.Flags.ManageRoles],
  botPermissions: [PermissionsBitField.Flags.ManageRoles],

  callback: async (client, interaction) => {
    const id1 = interaction.options.getString("id1");
    const label1 = interaction.options.getString("label1");
    const id2 = interaction.options.getString("id2");
    const label2 = interaction.options.getString("label2");
    const id3 = interaction.options.getString("id3");
    const label3 = interaction.options.getString("label3");
    const id4 = interaction.options.getString("id4");
    const label4 = interaction.options.getString("label4");

    try {
      const row = new ActionRowBuilder();

      row.components.push(
        new ButtonBuilder()
          .setCustomId(id1)
          .setLabel(label1)
          .setStyle(ButtonStyle.Success)
      );

      if (id2 !== null) {
        row.components.push(
          new ButtonBuilder()
            .setCustomId(id2)
            .setLabel(label2)
            .setStyle(ButtonStyle.Success)
        );
      }

      if (id3 !== null) {
        row.components.push(
          new ButtonBuilder()
            .setCustomId(id3)
            .setLabel(label3)
            .setStyle(ButtonStyle.Success)
        );
      }

      await interaction.reply({
        content: "Nachricht erfolgreich gesendet!",
        ephemeral: true,
      });
      await interaction.channel.send({
        components: [row],
      });

    } catch (error) {
      console.error("Fehler beim Antworten auf den Befehl:", error);
    }
  },
};
