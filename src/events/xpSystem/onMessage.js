const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

db.run(`CREATE TABLE IF NOT EXISTS users (
  userId TEXT PRIMARY KEY,
  xp INTEGER DEFAULT 0
)`);

// Funktion zum Hinzufügen von XP zu einem Benutzer
function addXP(userId, xpToAdd) {
  return new Promise((resolve, reject) => {
    db.get('SELECT xp FROM users WHERE userId = ?', userId, (err, row) => {
      if (err) {
        reject(err);
      } else {
        let xp = xpToAdd;
        if (row) {
          xp += row.xp;
        }
        db.run('INSERT OR REPLACE INTO users (userId, xp) VALUES (?, ?)', userId, xp, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(xp);
          }
        });
      }
    });
  });
}

// Funktion zum Abrufen des Levels basierend auf den XP
function getLevelFromXP(xp) {
    if (xp < 100) {
      return 0;
    } else if (xp < 250) {
      return 1;
    } else if (xp < 500) {
      return 2;
    } else if (xp < 1000) {
      return 3;
    }
  }

  module.exports = async (client) => {
    client.on('messageCreate', async (message) => {
      if (message.author.bot) {
        return;
      }
      
      const targetChannelId = message.channel.id;
      const userId = message.author.id;
      const xpToAdd = 20;
  
      const newXP = await addXP(userId, xpToAdd);
  
      const oldLevel = getLevelFromXP(newXP - xpToAdd);
      const newLevel = getLevelFromXP(newXP);
      if (newLevel > oldLevel) {
        const userTag = `<@${userId}>`; // Benutzer-Tag mit Mention
        const levelUpMessage = `Glückwunsch! ${userTag} hat Level ${newLevel} erreicht!`;
        const targetChannel = message.guild.channels.cache.get('1112701049808109656');
        targetChannel.send(levelUpMessage);
      }
    });
  };
