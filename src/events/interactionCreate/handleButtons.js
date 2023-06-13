module.exports = async (interaction) => {
    if (interaction.isButton()) {
      try {
        console.log("Button");
        const clickedButtonId = interaction.customId;
        console.log(clickedButtonId);
        if (clickedButtonId == '1112701047362834479') { 
          await interaction.reply({
            content: "Rolle erfolgreich hinzugefügt!",
            ephemeral: true,
          });
          await interaction.member.roles.add("1112701047362834479");
          console.log(
            interaction.member.displayName,
            "hat sich erfolgreich verifiziert. ✔"
          );
        }
      } catch (error) {
        console.log("Fehler beim Antworten auf einen Button!", error);
      }
    }
  };
  

  