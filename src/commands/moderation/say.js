const {
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    EmbedBuilder,
  } = require('discord.js');

  
  module.exports = {
    deleted: false,
    name: 'say',
    description: 'Der Bot versendet eine benutzerdefinierte Nachricht',
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
          name: 'color',
          description: 'Farbe der Embed Nachricht',
          type: ApplicationCommandOptionType.String,
          required: false,
        },

        {
          name: 'author',
          description: 'Name des Authors der Nachricht',
          type: ApplicationCommandOptionType.String,
          restricted: false,
        },

        {
          name: 'authorimg',
          description: 'Bild des Authors',
          type: ApplicationCommandOptionType.String,
          restricted: false,
        },

        {
          name: 'footer',
          description: 'Text des Footers',
          type: ApplicationCommandOptionType.String,
          restricted: false,
        },

        {
          name: 'footerimg',
          description: 'Bild des Footers',
          type: ApplicationCommandOptionType.String,
          restricted: false,
        }
        
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
  
    callback: async (client, interaction) => {

      const title = interaction.options.getString("title");
      const description = interaction.options.getString("description");
      const color = interaction.options.getString("color");
      const author = interaction.options.getString("author");
      const authorimg = interaction.options.getString("authorimg");
      const footer = interaction.options.getString("footer");
      const footerimg = interaction.options.getString("footerimg");
      const thumbnailimg = interaction.options.getString("thumbnailimg");

      if (!title || !description) {
        return interaction.reply(
          "Bitte gib sowohl den Title- als auch den Description-Text an."
        );
      }

      const body = interaction.options
      .getString("description")
      .replace(/\\n/g, "\n");

      const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(body)
      .setColor(color || '#6300ff')
      .setAuthor({
        name: author || "The 1% Journey ♠",
        iconURL: authorimg || "https://media.discordapp.net/attachments/558723762191859712/1112672987104165950/IMG_20230122_180234.jpg?width=636&height=636",
      })
      .setFooter({
        text: footer || 'The 1% Journey ♠',
        iconURL: footerimg || 'https://media.discordapp.net/attachments/558723762191859712/1112672987104165950/IMG_20230122_180234.jpg?width=636&height=636'
      })
      .setThumbnail('https://media.discordapp.net/attachments/558723762191859712/1112672987104165950/IMG_20230122_180234.jpg?width=502&height=502')
      //.setImage('https://media.discordapp.net/attachments/558723762191859712/1128300584978632704/die-1pjourney.png?width=1068&height=138')
      .setTimestamp();

      try {
        await interaction.reply({
          content: "Nachricht erfolgreich gesendet!",
          ephemeral: true,
        });
        await interaction.channel.send({ embeds: [embed] });

      } catch (error) {
        console.error("Fehler beim Antworten auf den Befehl:", error);
      }

    },
  };