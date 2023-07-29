module.exports = async (client, interaction) => {
    if (interaction.isButton()) {
      try {
        const clickedButtonId = interaction.customId;
        console.log(interaction.customId);
        if (clickedButtonId.startsWith("vote")) { 
        let splitButtonId = clickedButtonId.split('-');
        let newButtonId = clickedButtonId;
        if (splitButtonId[2] === ""){
            splitButtonId[2] = '1';
            newButtonId = splitButtonId.join('-');
        } else {
            let countWert = parseInt(splitButtonId[2], 10);
            countWert++;
            splitButtonId = splitButtonId.slice(0, 2) + countWert;
            newButtonId = splitButtonId.join('-');
        }
        interaction.customId = newButtonId;
        await interaction.reply({
            content: "Deine Stimme wurde erolgreicht hinzugefügt!",
            ephemeral: true,
          });
        }
        console.log(interaction.customId);
      } catch (error) {
        console.error("Fehler beim Verarbeiten des Button-Klicks:", error);
      }
    }
  };