const { PermissionsBitField, ApplicationCommandOptionType } = require("discord.js");
const sqlite3 = require("sqlite3").verbose();

  module.exports = {
    deleted: false,
    name: "reset-xp",
    description: "Setzt das XP eines Benutzers zurück.",
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
      {
          name: 'user',
          description: 'Der Benutzer, dessen XP zurückgesetzt werden soll.',
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
          db.run('UPDATE users SET xp = 0 WHERE userId = ?', userId, (err) => {
            if (err) {
              console.error("Fehler beim Zurücksetzen des XP:", err);
              interaction.reply({
                content: "Es ist ein Fehler beim Zurücksetzen des XP aufgetreten.",
                ephemeral: true,
              });
            } else {
              db.close();
              interaction.reply({
                content: `Das XP von <@${userId}> wurde erfolgreich zurückgesetzt.`,
                ephemeral: true,
              });
            }
          });
          
        } catch (error) {
          console.error("Fehler beim Zurücksetzen des XP:", error);
          await interaction.reply({
            content: "Es ist ein Fehler beim Zurücksetzen des XP aufgetreten.",
            ephemeral: true,
          });
        }
      },
  };