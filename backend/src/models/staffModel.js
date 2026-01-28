const { query } = require('../config/db');

async function findByEmail(email) {
  const rows = await query(
    `SELECT id, name, email, password_hash, role, created_at
     FROM staff
     WHERE email = ?
     LIMIT 1`,
    [email]
  );
  return rows[0] || null;
}

async function getById(id) {
  const rows = await query(
    `SELECT id, name, email, role, created_at
     FROM staff
     WHERE id = ?
     LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

async function listStaff() {
  return query(`SELECT id, name, email, role, created_at FROM staff ORDER BY id DESC`);
}

async function createStaff({ name, email, passwordHash, role }) {
  const rows = await query(
    `INSERT INTO staff (name, email, password_hash, role)
     VALUES (?, ?, ?, ?)`,
    [name, email, passwordHash, role || 'staff']
  );
  return { id: rows.insertId, name, email, role: role || 'staff' };
}

async function deleteStaff(id) {
  const rows = await query(`DELETE FROM staff WHERE id = ?`, [id]);
  return rows.affectedRows > 0;
}

module.exports = { findByEmail, getById, listStaff, createStaff, deleteStaff };

