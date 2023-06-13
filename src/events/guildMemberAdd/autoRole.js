module.exports = async (member) => {
  try {
    let guild = member.guild;
    if (!guild) return;

    await member.roles.add('1118098366858014764');
  } catch (error) {
    console.log(`Fehler im Event/AutoRole: ${error}`);
  }
};

