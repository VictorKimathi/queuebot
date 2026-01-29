const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../../queue_system.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

async function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    try {
      const upperSql = sql.trim().toUpperCase();
      const stmt = db.prepare(sql);
      if (upperSql.startsWith('SELECT') || upperSql.startsWith('PRAGMA')) {
        const rows = stmt.all(params);
        resolve(rows);
      } else {
        const info = stmt.run(params);
        resolve({ insertId: info.lastInsertRowid, affectedRows: info.changes });
      }
    } catch (err) {
      reject(err);
    }
  });
}

async function withTransaction(fn) {
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction(() => {
        return fn(db);
      });
      const result = transaction();
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { query, withTransaction };

