const {
  ApplicationCommandOptionType,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.db");
const EmbedBuilderUtil = require("../../utils/embedBuilder");

module.exports = {
  deleted: false,
  name: "close-ticket",
  description: "Der Bot schließt das Ticket des Nutzers.",
  // devOnly: Boolean,
  // testOnly: Boolean,
  
  permissionsRequired: [PermissionsBitField.Flags.ManageRoles],
  botPermissions: [PermissionsBitField.Flags.ManageRoles],

  callback: async (client, interaction) => {
    const guild = interaction.guild;
    const userId = interaction.user.id;
    try {
      
      db.get(
        "SELECT channelId FROM tickets WHERE userId = ?",
        [userId],
        async (err, row) => {
          if (err) {
            console.error("Fehler beim Abrufen des Tickets aus der Datenbank:", err);
            return;
          }
          if (row && row.channelId) {
            const existingTicketChannel = guild.channels.cache.get(row.channelId);
            try {
              if (existingTicketChannel) {
                existingTicketChannel.delete();
                const channelId = existingTicketChannel.id;
                await interaction.reply({
                  content: `Das Ticket wurde erfolgreich geschlossen !`,
                  ephemeral: true,
                });
                deleteTicketChannel(channelId);
              } else {
                console.log(`Ticket-Kanal nicht gefunden.`);
                const channelId = row.channelId;
                await interaction.reply({
                  content: `Dein Ticket ist nicht mehr verfügbar.`,
                  ephemeral: true,
                });
                deleteTicketChannel(channelId);
              }
            } catch (error) {
              console.error("Fehler beim Antworten auf den Befehl:", error);
              return;
            }
          } else {
            await interaction.reply({
              content: `Sie haben kein Aktives Ticket oder es konnte kein Ticket gefunden werden.`,
              ephemeral: true,
            });
          }
          function deleteTicketChannel(channelId) {
            db.run('DELETE FROM tickets WHERE channelId = ?', channelId, (err) => {
              if (err) {
                console.error('Fehler beim Löschen des Ticket-Kanals aus der Datenbank:', err);
              } else {
                console.log('Ticket-Kanal erfolgreich aus der Datenbank gelöscht!');
              }
            });
          }

        }
        );

    } catch (error) {
      console.error("Fehler beim Antworten auf den Befehl:", error);
    }
    
  },
};
