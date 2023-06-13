const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");
const EmbedBuilderUtil = require("../../utils/embedBuilder");

module.exports = {
  deleted: false,
  name: "unban",
  description: "Entbannt einen Benutzer!",
  // devOnly: Boolean,
  // testOnly: Boolean,
  options: [
    {
      name: "ziel-benutzer",
      description: "Der zu entbannende Benutzer.",
      required: true,
      type: ApplicationCommandOptionType.User,
    },
    {
      name: "grund",
      description: "Der Grund für die Entbannung.",
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.ADMINISTRATOR],
  botPermissions: [PermissionFlagsBits.ADMINISTRATOR],

  callback: async (client, interaction) => {
    const logChannelId = "1112701051066400852";
    const memberTag = `<@${interaction.member.id}>`;

    const targetUser = interaction.options.getUser("ziel-benutzer");
    const reason =
      interaction.options.getString("grund") || "Kein Grund angegeben";

    try {
      await interaction.guild.members.unban(targetUser, { reason });
      await interaction.reply({
        content: `Der Benutzer ${targetUser} wurde erfolgreich entbannt. Grund: ${reason}`,
        ephemeral: true,
      });

      const logChannel = await client.channels.fetch(logChannelId);

      const embed = EmbedBuilderUtil.createBasicEmbed(
        `Der Befehl \`/unban\` wurde verwendet.`, 
        `${memberTag} hat ${targetUser} vom Discord Server entbannt. \n **Grund:** *${reason}*`
      );

      logChannel.send({
        embeds: [embed],
      });

    } catch (error) {
      await interaction.reply(
        "Es ist ein Fehler aufgetreten beim Entbannen des Benutzers."
      );
    }
  },
};
