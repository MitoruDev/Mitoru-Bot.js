const { PermissionsBitField, ApplicationCommandOptionType } = require("discord.js");
const sqlite3 = require("sqlite3").verbose();

module.exports = {
  deleted: false,
  name: "set-xp",
  description: "Setzt das XP eines Benutzers.",
  options: [
    {
      name: 'user',
      description: 'Der Benutzer, dessen XP verändert werden soll.',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: 'xp',
      description: 'Die XP, die der Benutzer haben soll.',
      type: ApplicationCommandOptionType.Integer,
      required: true,
    }
  ],
  permissionsRequired: [PermissionsBitField.Flags.ManageRoles],
  botPermissions: [PermissionsBitField.Flags.ManageRoles],

  callback: async (client, interaction) => {
    try {
      const userId = interaction.options.getUser("user").id;
      const xp = interaction.options.getInteger("xp");

      const db = new sqlite3.Database('database.db');
      db.run('UPDATE users SET xp = ? WHERE userId = ?', xp, userId, (err) => {
        if (err) {
          console.error("Fehler beim Festlegen der XP:", err);
          interaction.reply({
            content: "Es ist ein Fehler beim Festlegen der XP aufgetreten.",
            ephemeral: true,
          });
        } else {
          db.close();
          interaction.reply({
            content: `Die XP von <@${userId}> wurden erfolgreich auf ${xp} festgelegt.`,
            ephemeral: true,
          });
        }
      });
    } catch (error) {
      console.error("Fehler beim Festlegen der XP:", error);
      await interaction.reply({
        content: "Es ist ein Fehler beim Festlegen der XP aufgetreten.",
        ephemeral: true,
      });
    }
  },
};
