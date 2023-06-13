const {
  ApplicationCommandOptionType,
  PermissionsBitField,
} = require("discord.js");
const EmbedBuilderUtil = require("../../utils/embedBuilder");
const ms = require('ms');

module.exports = {
  deleted: false,
  name: "ban",
  description: "Bannt ein Mitglied!",
  // devOnly: Boolean,
  // testOnly: Boolean,
  options: [
    {
      name: "ziel-benutzer",
      description: "Der zu bannende Benutzer.",
      required: true,
      type: ApplicationCommandOptionType.User,
    },
    {
      name: "grund",
      description: "Der Grund für den Bann.",
      type: ApplicationCommandOptionType.String,
    },
  ],
  
  permissionsRequired: [PermissionsBitField.Flags.BanMembers],
  botPermissions: [PermissionsBitField.Flags.BanMembers],

  callback: async (client, interaction) => {
    const logChannelId = "1112701051066400852";
    const memberTag = `<@${interaction.member.id}>`;
    const targetUser = interaction.options.getUser("ziel-benutzer");
    const reason =
      interaction.options.getString("grund") || "Kein Grund angegeben";
    const executingMember = interaction.guild.members.cache.get(
        interaction.member.id
      );
    const targetMember = interaction.guild.members.cache.get(targetUser.id);

    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.reply({
        content: "Du kannst diesen Benutzer nicht bannen, da er der Serverinhaber ist.",
        ephemeral: true,
    });
      return;
    }

    if (targetMember.roles.highest.position >= executingMember.roles.highest.position) {
      await interaction.reply({
        content: "Der zu bannende Benutzer hat eine gleichgestellte oder höhere Rolle als du.",
        ephemeral: true,
      });
      return;
    }
    
    try {
      await interaction.guild.members.ban(targetUser, { reason });
      await interaction.reply({
        content: `Der Benutzer ${targetUser} wurde erfolgreich gebannt. Grund: ${reason}`,
        ephemeral: true,
      });

      const embed = EmbedBuilderUtil.createBasicEmbed(
        `Der Befehl \`/ban\` wurde verwendet.`, 
        `${memberTag} hat ${targetUser} vom Discord Server gebannt. \n **Grund:** *${reason}*`
      );

      const logChannel = await client.channels.fetch(logChannelId);
      logChannel.send({
        embeds: [embed],
      });
    } catch (error) {
      await interaction.reply(
        "Es ist ein Fehler aufgetreten beim Bannen des Benutzers."
      );
    }
  },
};
