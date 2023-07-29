const sqlite3 = require('sqlite3').verbose();

// Erstelle eine neue SQLite-Datenbank-Instanz
const db = new sqlite3.Database('database.db');

// Erstelle die Tabelle "users", falls sie noch nicht existiert
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    userId TEXT PRIMARY KEY,
    xp INTEGER DEFAULT 0
  )
`);

module.exports = db;
