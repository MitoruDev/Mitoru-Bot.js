const { PermissionsBitField, ApplicationCommandOptionType } = require("discord.js");
const sqlite3 = require("sqlite3").verbose();

function getLevelFromXP(xp) {
    if (xp < 100) {
      return 0;
    } else if (xp < 250) {
      return 1;
    } else if (xp < 500) {
      return 2;
    } else if (xp < 1000) {
      return 3;
    }
  }

module.exports = {
  deleted: false,
  name: "info-xp",
  description: "Gibt aus, wie viel XP sowie Level ein Nutzer hat.",
  // devOnly: Boolean,
  // testOnly: Boolean,
  options: [
    {
      name: 'user',
      description: 'Der Benutzer, dessen Info ausgegeben werden soll.',
      type: ApplicationCommandOptionType.User,
      required: true,
    }
  ],
  permissionsRequired: [PermissionsBitField.Flags.ManageRoles],
  botPermissions: [PermissionsBitField.Flags.ManageRoles],

  callback: async (client, interaction) => {
    try {
      const userId = interaction.options.getUser("user").id;

      const db = new sqlite3.Database('database.db');
      db.get('SELECT xp FROM users WHERE userId = ?', userId, (err, row) => {
        if (err) {
          console.error("Fehler beim Abrufen der XP:", err);
          interaction.reply({
            content: "Es ist ein Fehler beim Abrufen der XP aufgetreten.",
            ephemeral: true,
          });
        } else {
          const xp = row ? row.xp : 0;
          db.close();
          const level = getLevelFromXP(xp);
          interaction.reply({
            content: `Der <@${userId}> hat ${xp} XP und ist somit Level ${level}.`,
            ephemeral: true,
          });
        }
      });

    } catch (error) {
      console.error("Fehler beim Abrufen der XP:", error);
      await interaction.reply({
        content: "Es ist ein Fehler beim Abrufen der XP aufgetreten.",
        ephemeral: true,
      });
    }
  },
};
