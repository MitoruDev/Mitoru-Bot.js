const {
  ApplicationCommandOptionType,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const EmbedBuilderUtil = require("../../utils/embedBuilder");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.db");

module.exports = async (client) => {
  const targetChannelId = "1121744109875499158";

  client.on("voiceStateUpdate", async (oldState, newState) => {
    const newChannel = newState.channel;
    const oldChannel = oldState.channel;
    const member = newState.member;
    let channelExists = false;
    db.all('SELECT * FROM joinToCreate', (err, records) => {
      if (!Array.isArray(records)) {
        records = []; // Setze records auf ein leeres Array, wenn es nicht definiert ist oder kein Array ist
      }
      channelExists = records.some((record) => record.channelId === oldChannel.id);

    if (newChannel && newChannel.id === targetChannelId) {
      const username = member.user.username;
      const userid = member.user.id;
      const cleanUsername = username.toLowerCase().replace(/[\W\s]/g, "-");

      //Überprüfe ob schon ein Kanal offen ist.
      db.get(
        "SELECT channelId FROM joinToCreate WHERE userId = ?",
        userid,
        async (err, row) => {
          if (err) {
            console.error(
              "Fehler beim Überfüren ob schon ein Kanal offen ist.",
              err
            );
          }
          if (row) {
            const userChannel = row.channelId;
            member.voice.setChannel(userChannel);
          } else {
            // Sprachkanal erstellen
            const guild = member.guild;
            const channelName = `🔊｜${cleanUsername}`;
            const createdChannel = await guild.channels.create({
              type: 2,
              name: channelName,
              parent: newChannel.parent,
            });
            channelId = createdChannel.id;

            saveTicketChannel(userid, channelId);
            function saveTicketChannel(userId, channelId) {
              db.run(
                "INSERT INTO joinToCreate (userId, channelId) VALUES (?, ?)",
                userId,
                channelId,
                (err) => {
                  if (err) {
                    console.error(
                      "Fehler beim Speichern des joinToCreate-Kanals:",
                      err
                    );
                  } else {
                    console.log("joinToCreate-Kanal erfolgreich gespeichert!");
                  }
                }
              );
            }

            // Benutzer in den neuen Sprachkanal verschieben
            await member.voice.setChannel(createdChannel);
            const closeemote = `<:close:1125890566069174302>`;
            const editemote = `<:edit:1125890558976606248>`;
            const openemote = `<:open:1125890563384811561>`;
            const row = new ActionRowBuilder();

            const embed = EmbedBuilderUtil.createBasicEmbed(
              "Kanalverwaltung",
              `Die angehangenen Buttons ermöglichen es dir, dein Kanal anzupassen ${editemote}, ein Kanal zu öffnen ${openemote}, ein Kanal zu schließen ${closeemote} sowie viele weitere Funktionen.`
            );

            row.components.push(
              new ButtonBuilder()
                .setCustomId(`joinToCreate-edit`)
                .setLabel(`Kanal bearbeiten`)
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("1125890558976606248")
            );
            row.components.push(
              new ButtonBuilder()
                .setCustomId(`joinToCreate-open`)
                .setLabel(`Kanal öffnen`)
                .setStyle(ButtonStyle.Success)
                .setEmoji("1125890563384811561")
            );
            row.components.push(
              new ButtonBuilder()
                .setCustomId(`joinToCreate-invite`)
                .setLabel(`Einladung erstellen`)
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("1125890554329317409")
            );

            row.components.push(
              new ButtonBuilder()
                .setCustomId(`joinToCreate-close`)
                .setLabel(`Kanal schließen`)
                .setStyle(ButtonStyle.Danger)
                .setEmoji("1125890566069174302")
            );

            await createdChannel.send({
              embeds: [embed],
              components: [row],
            });
          }
        }
      );
    } else if (oldChannel && channelExists) {
      const members = oldChannel.members.size;
      const oldChannelId = oldChannel.id;
      db.run("DELETE FROM joinToCreate where channelId = ?",oldChannelId, (err) => {
        if (err) {
          console.error(
            "Fehler beim Löschen eines Satzes aus joinToCreate:",
            err
          );
        }
      })
      if (members === 0) {
        oldChannel
          .delete()
          .then(() => {
            console.log(
              `Der Kanal ${oldChannel.name} wurde gelöscht, da kein Benutzer mehr darin ist.`
            );
          })
          .catch((error) => {});
      }
    }
  });
});
};
