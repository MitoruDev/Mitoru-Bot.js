const {
  ChannelType,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Discord,
  MessageEmbed,
} = require("discord.js");
const { EmbedBuilder } = require("discord.js");

const EmbedBuilderUtil = require("../../utils/embedBuilder");
const config = require("../../../config.json");
const modRoles = config.modRoles;
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.db");
const inviteemote = "<:invite:1125890554329317409>";
const closeemote = `<:close:1125890566069174302>`;
const editemote = `<:edit:1125890558976606248>`;
const openemote = `<:open:1125890563384811561>`;


module.exports = async (client, interaction) => {
  if (interaction.isButton()) {
    try {
      const clickedButtonId = interaction.customId;
      const username = interaction.user.username;
      const channelId = interaction.channelId;
      const channel = interaction.channel;

      if (clickedButtonId === "joinToCreate-edit") {
        const embed = EmbedBuilderUtil.createBasicEmbed(
          `Kanal-Bearbeiten ${editemote}`,
          `Diese Funktion ist derzeit in Wartung und kann nicht verwendet werden.`
        );
        try {
          await interaction.reply({ 
            embeds: [embed],
            ephemeral: true,
           });
        } catch (error) {
          console.error("Fehler beim Antworten auf den Befehl:", error);
        }

      } else if (clickedButtonId === "joinToCreate-close") {
        db.get(
          "SELECT userId FROM joinToCreate WHERE channelId = ?",
          channelId,
          async (err, row) => {
            if (err) {
              console.error(
                "Fehler beim Abrufen des Tickets aus der Datenbank:",
                err
              );
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
            } else {
              db.run('DELETE FROM joinToCreate where ChannelId = ?',channelId, (err) => {
                if(err){
                  console.error(
                    "Fehler beim Löschen eines Satzes aus joinToCreate:",
                    err
                  );
                }
              })
            }

            const userId = row.userId;
    
            const user = await client.users.fetch(userId);

            if (interaction.user.id === user.id) {
              const voiceChannel = client.channels.cache.get(interaction.channelId);
              
              if (voiceChannel) {
                const embed = EmbedBuilderUtil.createBasicEmbed(
                  `Kanal-Schließen ${closeemote}`,
                  `Ihr Sprachkanal wird innerhalb der nächsten 3 Sekunden geschlossen !`
                );
            
                try {
                  await interaction.reply({ 
                    embeds: [embed],
                    ephemeral: true,
                   });
                   setTimeout(() => {
                    voiceChannel.delete();
                  }, 3000);
                } catch (error) {
                  console.error("Fehler beim Antworten auf den Befehl:", error);
                }
              } else {
                console.log(`Sprachkanal nicht gefunden.`);
              }
            } else {
              await interaction.reply({
                content: `Du bist nicht berechtigt, diesen Sprachkanal zu löschen.`,
                ephemeral: true,
              });
            }
          }
        );
      } else if (clickedButtonId === "joinToCreate-invite") {
        const invite = await interaction.channel.createInvite();
        const embed = EmbedBuilderUtil.createBasicEmbed(
          `Kanal-Einladung ${inviteemote}`,
          `Hier ist der Einladungslink zu ihrem Kanal: \n ${channel.toString()}`
        );
    
        try {
          await interaction.reply({ 
            embeds: [embed],
            ephemeral: true,
           });
        } catch (error) {
          console.error("Fehler beim Antworten auf den Befehl:", error);
        }
      } else if (clickedButtonId === "joinToCreate-open") {
        const embed = EmbedBuilderUtil.createBasicEmbed(
          `Kanal-Öffnen ${openemote}`,
          `Sie haben bereits ein Sprachkanal geöffnet: \n ${channel.toString()}`
        );
        try {
          await interaction.reply({ 
            embeds: [embed],
            ephemeral: true,
           });
        } catch (error) {
          console.error("Fehler beim Antworten auf den Befehl:", error);
        }
      }
    } catch (error) {
      console.error("Fehler beim Verarbeiten des Button-Klicks:", error);
    }
  }
};
