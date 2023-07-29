const {
    ApplicationCommandOptionType,
    PermissionsBitField,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
  } = require("discord.js");
  const sqlite3 = require("sqlite3").verbose();
  const db = new sqlite3.Database("database.db");
  const EmbedBuilderUtil = require("../../utils/embedBuilder.js");
  
  module.exports = {
    deleted: false,
    name: "info-ticket",
    description: "Der Bot gibt aus welcher Nutzer das Ticket erstellt hat.",
    // devOnly: Boolean,
    // testOnly: Boolean,,
    permissionsRequired: [PermissionsBitField.Flags.ManageRoles],
    botPermissions: [PermissionsBitField.Flags.ManageRoles],
  
    callback: async (client, interaction) => {
      
      try {
        const channelId = interaction.channelId;

        // Daten aus der Datenbank abrufen
        db.get(
          "SELECT userId, Id FROM tickets WHERE channelId = ?",
          channelId,
          async (err, row) => {
            if (err) {
              console.error("Fehler beim Abrufen des Tickets aus der Datenbank:", err);
              await interaction.reply({
                content: "Es ist ein Fehler aufgetreten.",
                ephemeral: true,
              });
              return;
            }
      
            if (!row) {
              await interaction.reply({
                content: "Das Ticket für diesen Kanal existiert nicht.",
                ephemeral: true,
              });
              return;
            }
      
            const userId = row.userId;
      
            // Weitere Informationen zu dem Ticket abrufen oder anzeigen
            // Hier kannst du den Code entsprechend deinen Anforderungen anpassen
      
            // Beispiel: Benutzerinformationen abrufen
            const user = await client.users.fetch(userId);
      
            // Beispiel: Eine Embed-Nachricht erstellen und senden
            await interaction.reply({
              content: `Das Ticket wurde von ${user} erstellt.`,
              ephemeral: true,
            });
          }
        );
      } catch (error) {
        console.error("Fehler beim Antworten auf den Befehl:", error);
        await interaction.reply({
          content: "Es ist ein Fehler aufgetreten.",
          ephemeral: true,
        });
      }
    },
  };
  