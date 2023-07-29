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
    name: "setup-vote",
    description: "Der Bot versendet eine Umfrage in Form einer Nachricht mit Buttons zur Auswahl",
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
      {
          name: 'title',
          description: 'Titel der Umfrage',
          type: ApplicationCommandOptionType.String,
          required: true,
      },
  
      {
          name: 'description',
          description: 'Beschreibung der Umfrage',
          type: ApplicationCommandOptionType.String,
          required: true,
      },
  
      {
        name: "label1",
        description: "Auswahlmöglichkeit. 1",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
  
      {
        name: "label2",
        description: "Auswahlmöglichkeit. 2",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
  
      {
        name: "label3",
        description: "Auswahlmöglichkeit. 3",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
  
      {
        name: "label4",
        description: "Auswahlmöglichkeit. 4",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
    ],
    permissionsRequired: [PermissionsBitField.Flags.ManageRoles],
    botPermissions: [PermissionsBitField.Flags.ManageRoles],
  
    callback: async (client, interaction) => {
      const title = interaction.options.getString("title");
      const description = interaction.options.getString("description");
      
      const label1 = interaction.options.getString("label1");
      const label2 = interaction.options.getString("label2");
      const label3 = interaction.options.getString("label3");
      const label4 = interaction.options.getString("label4");
      const id1 = ('vote1-' + label1 + '-');
      const id2 = ('vote2-' + label2 + '-');
      let id3 = null;
      let id4 = null;
      if (label3 !== null) {
        id3 = ('vote3-' + label3 + '-');
      }
      if (label4 !== null) {
        id4 = ('vote4-' + label4 + '-');
      } 



      const body = interaction.options
        .getString("description")
        .replace(/\\n/g, "\n");
  
      try {
        const row = new ActionRowBuilder();
  
        row.components.push(
          new ButtonBuilder()
            .setCustomId(id1)
            .setLabel(label1)
            .setStyle(ButtonStyle.Primary)
        );
  
        if (id2 !== null) {
          row.components.push(
            new ButtonBuilder()
              .setCustomId(id2)
              .setLabel(label2)
              .setStyle(ButtonStyle.Secondary)
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
  
        if (id4 !== null) {
          row.components.push(
            new ButtonBuilder()
              .setCustomId(id4)
              .setLabel(label4)
              .setStyle(ButtonStyle.Danger)
          );
        }
  
        const embed = EmbedBuilderUtil.createBasicEmbed(
          title,
          body
        );
  
        await interaction.reply({
          content: "Nachricht erfolgreich gesendet!",
          ephemeral: true,
        });
        await interaction.channel.send({
          embeds: [embed],
          components: [row],
        });
      } catch (error) {
        console.error("Fehler beim Antworten auf den Befehl:", error);
      }
    },
  };
  