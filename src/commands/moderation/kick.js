const { ApplicationCommandOptionType,  PermissionsBitField } = require('discord.js');
const EmbedBuilderUtil = require("../../utils/embedBuilder");

module.exports = {
  deleted: false,
  name: 'kick',
  description: 'Kickt ein Mitglied!',
  // devOnly: Boolean,
  // testOnly: Boolean,
  options: [
    {
      name: 'ziel-benutzer',
      description: 'Der zu kickende Benutzer.',
      required: true,
      type: ApplicationCommandOptionType.User,
    },
    {
      name: 'grund',
      description: 'Der Grund für den Kick.',
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionsBitField.Flags.KickMembers],
  botPermissions: [PermissionsBitField.Flags.KickMembers],

  callback: async (client, interaction) => {
    const logChannelId = "1112701051066400852";
    const memberTag = `<@${interaction.member.id}>`;
    const targetUser = interaction.options.getUser('ziel-benutzer');
    const reason = interaction.options.getString('grund') || 'Kein Grund angegeben';
    const executingMember = interaction.guild.members.cache.get(interaction.member.id);
    const targetMember = interaction.guild.members.cache.get(targetUser.id);

    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.reply({
        content: "Du kannst diesen Benutzer kicken, da er der Serverinhaber ist.",
        ephemeral: true,
    });
      return;
    }

    if (targetMember.roles.highest.position >= executingMember.roles.highest.position) {
      await interaction.reply({
        content: "Der zu kickende Benutzer hat eine gleichgestellte oder höhere Rolle als du.",
        ephemeral: true,
      });
      return;
    }

    try {
      await interaction.guild.members.kick(targetUser, { reason });
      await interaction.reply({
        content: `Der Benutzer ${targetUser} wurde erfolgreich gekickt. Grund: ${reason}`,
        ephemeral: true,
      });

      const logChannel = await client.channels.fetch(logChannelId);

      const embed = EmbedBuilderUtil.createBasicEmbed(
        `Der Befehl \`/kick\` wurde verwendet.`, 
        `${memberTag} hat ${targetUser} vom Discord Server gekickt. \n **Grund:** *${reason}*`
      );

      logChannel.send({
        embeds: [embed],
      });

    } catch (error) {
      await interaction.reply('Es ist ein Fehler aufgetreten beim Kicken des Benutzers.');
    }
  },
};
