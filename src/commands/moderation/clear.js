const { ApplicationCommandOptionType,  PermissionsBitField } = require('discord.js');
const EmbedBuilderUtil = require("../../utils/embedBuilder");

module.exports = {
  name: "clear",
  description: "Löscht eine bestimmte Anzahl von Nachrichten aus dem Chat-Verlauf",
  options: [
    {
      name: "anzahl",
      description: "Die Anzahl der zu löschenden Nachrichten.",
      required: true,
      type: ApplicationCommandOptionType.Number,
    },
  ],
  permissionsRequired: [PermissionsBitField.Flags.ManageMessages],
  botPermissions: [PermissionsBitField.Flags.ManageMessages],

  async callback(client, interaction) {


    // Log Channel-ID
    const logChannelId = "1112701051066400852";

    // Formatierung des Zeitstempels
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const seconds = String(currentDate.getSeconds()).padStart(2, "0");
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    const count = interaction.options.getNumber("anzahl");
    const channelLink = `<#${interaction.channel.id}>`;
    const memberTag = `<@${interaction.member.id}>`;

    if (count < 1) {
      await interaction.reply({
        content: "Die Anzahl der zu löschenden Nachrichten muss mindestens 1 sein.",
        ephemeral: true,
      });
      return;
    } else if (count > 100) {
      await interaction.reply({
        content: "Die Anzahl der zu löschenden Nachrichten darf nicht größer als 100 sein.",
        ephemeral: true,
      });
      return;
    }

    const messages = await interaction.channel.messages.fetch({ limit: count});
    const messageCount = messages.size; // Die Anzahl der Nachrichten abzüglich der Befehlsnachricht

    if (messageCount === 0) {
      await interaction.reply({
        content: "Es gibt keine Nachrichten zum Löschen.",
        ephemeral: true,
      });
      return;
    }

    const messagesToDelete = messages.first(count);
    await interaction.channel.bulkDelete(messagesToDelete, true);

    const deletedCount = messagesToDelete.size;
    await interaction.reply({
      content: `${messageCount} Nachricht(en) wurden erfolgreich gelöscht.`,
      ephemeral: true,
    });

    const logChannel = await client.channels.fetch(logChannelId);

    const embed = EmbedBuilderUtil.createBasicEmbed(
      `Der Befehl \`/clear\` wurde verwendet.`, 
      `${memberTag} hat **${messageCount}** Nachricht(en) im Kanal ${channelLink} gelöscht!`
    );

    logChannel.send({
      embeds: [embed],
    });
  },
};

