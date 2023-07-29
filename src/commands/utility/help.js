const EmbedBuilderUtil = require("../../utils/embedBuilder");
const config = require("../../../config.json");

module.exports = {
  deleted: false,
  name: "help",
  description: "Zeigt eine Liste der verfügbaren Befehle an.",
  // devOnly: Boolean,
  // testOnly: Boolean,

  callback: async (client, interaction) => {
    
    let helpMessage = "";
    for (const category in config.commands) {
      helpMessage += `**${category}**\n`;

      for (const command in config.commands[category]) {
        const description = config.commands[category][command];
        helpMessage += `\`${command}\` - ${description}\n`;
      }
      helpMessage += "\n";
    }

    const embed = EmbedBuilderUtil.createBasicEmbed(
      "Help - Befehle für den 1% Journey Bot",
      helpMessage
    );

    try {
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Fehler beim Antworten auf den Befehl:", error);
    }
  },

};

