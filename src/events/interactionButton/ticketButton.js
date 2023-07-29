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
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

module.exports = async (client, interaction) => {
  if (interaction.isButton()) {
    try {
      const clickedButtonId = interaction.customId;
      const username = interaction.user.username;
      const userId = interaction.user.id;

      // Button zum Erstellen eines Tickets
      if (clickedButtonId === "createticket") {
        const guild = interaction.guild;
        const cleanUsername = username.toLowerCase().replace(/[\W\s]/g, "-");
        const logChannel = client.channels.cache.get('1112701051066400852');

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
              const embed = EmbedBuilderUtil.createBasicEmbed(
                "Ticket-System 🎫",
                `Du hast bereits ein offenes Ticket in: ${existingTicketChannel}`
              );
              const isChannel = row.channelId;

              try {
                await interaction.reply({
                  embeds: [embed],
                  ephemeral: true,
                });
                return;
              } catch (error) {
                console.error("Fehler beim Antworten auf den Befehl:", error);
                return;
              }
            }

            if (!row) {
              const ticketChannel = await guild.channels.create({
                type: ChannelType.GuildText,
                name: `💬Ticket: ${username}`,
                parent: interaction.channel.parentId,
                permissionOverwrites: [
                  {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                  },
                  {
                    id: interaction.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                  },
                ],
              });

              const channelId = ticketChannel.id;
              db.run(`CREATE TABLE IF NOT EXISTS tickets (id INTEGER PRIMARY KEY AUTOINCREMENT,userId TEXT,channelId TEXT)`,
                (err) => {
                  if (err) {
                    console.error(
                      'Fehler beim Erstellen der Tabelle "tickets":',
                      err
                    );
                  } else {
                    console.log('Die Tabelle "tickets" wurde erfolgreich erstellt.');
                  }
                }
              );
              saveTicketChannel(userId, channelId);

              function saveTicketChannel(userId, channelId) {
                db.run('INSERT INTO tickets (userId, channelId) VALUES (?, ?)', userId, channelId, (err) => {
                  if (err) {
                    console.error('Fehler beim Speichern des Ticket-Kanals:', err);
                  } else {
                    console.log('Ticket-Kanal erfolgreich gespeichert!');
                  }
                });
              }

              

              // Nachricht im Ticket-Kanal
              const row = new ActionRowBuilder();

              row.components.push(
                new ButtonBuilder()
                  .setCustomId(`ticket-close`)
                  .setLabel("Ticket schließen ❌")
                  .setStyle(ButtonStyle.Danger)
              );

              row.components.push(
                new ButtonBuilder()
                  .setCustomId(`ticket-claim`)
                  .setLabel("Ticket claimen 🔰")
                  .setStyle(ButtonStyle.Success)
              );

              const embed = EmbedBuilderUtil.createBasicEmbed(
                `Ticket: ${ticketChannel}`,
                `Ein Teammitglied wird dieses Ticket schnellstmöglich bearbeiten.`
              );

              const embedLog = EmbedBuilderUtil.createBasicEmbed(
                `Ticket: ${ticketChannel}, wurde erstellt.`,
                `Ein Teammitglied sollte das Ticket schnellstmöglich bearbeiten.`
              );

              await logChannel.send({
                embeds: [embedLog]
              });

              await ticketChannel.send({
                embeds: [embed],
                components: [row],
              });

              const embed2 = EmbedBuilderUtil.createBasicEmbed(
                `Ticket-System 🎫`,
                `Ein Ticket-Kanal wurde erfolgreich erstellt: \n ${ticketChannel}`
              );

              try {
                return await interaction.reply({
                  embeds: [embed2],
                  ephemeral: true,
                });
              } catch (error) {
                console.error("Fehler beim Antworten auf den Befehl:", error);
              }
            }
          });
      }

      // Buttons im Ticket
      else if (interaction.customId.startsWith("ticket-")) {
        const ticketId1 = interaction.customId.split('-')[1];
        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.user.id);
        const hasModRole = member.roles.cache.some(role => modRoles.includes(role.id));

        if (ticketId1 === 'claim') {
          if (hasModRole) {
            await interaction.reply({
              content: `Das Ticket wurde erfolgreich geclaimed !`,
              ephemeral: true,
            });

            const channel = await client.channels.fetch(interaction.channelId);

            const embed = EmbedBuilderUtil.createBasicEmbed(
              `Ticket wurde geclaimed !`,
              `${member} hat das Ticket gelaimed, und wird versuchen das Problem zu lösen.`
            );

            await channel.send({
              embeds: [embed],
            });

            const messages = await channel.messages.fetch({ limit: 1 });
            const firstMessage = messages.first();
            /*if (firstMessage) {
              const embed = firstMessage.embeds[0];
          
              if (embed) {
                let newEmbed = new MessageEmbed(embed);
                newEmbed.setDescription("Neue Beschreibung der Nachricht");
          
                firstMessage.edit({ embeds: [newEmbed] });
          
                console.log('Die Beschreibung der Nachricht wurde erfolgreich bearbeitet.');
              } else {
                console.log('Die Nachricht enthält kein eingebettetes Objekt.');
              }
            }*/
          } else {
            await interaction.reply({
              content: `Du verfügst nicht über die Berechtigungen um das Ticket zu claimen !`,
              ephemeral: true,
            });
          }
        } else if (ticketId1 === 'close') {
          await interaction.reply({
            content: `Das Ticket wurde erfolgreich geschlossen !`,
            ephemeral: true,
          });
          const ticketChannel = interaction.channel;
          if (ticketChannel) {
            ticketChannel.delete();
            const channelId = ticketChannel.id;
            deleteTicketChannel(channelId);
          } else {
            console.log(`Ticket-Kanal nicht gefunden.`);
          }
        }
      }
    } catch (error) {
      console.error("Fehler beim Verarbeiten des Button-Klicks:", error);
    }
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
};
