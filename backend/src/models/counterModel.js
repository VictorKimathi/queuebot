const { query } = require('../config/db');

async function createCounter({ name }) {
  const rows = await query(`INSERT INTO counters (name) VALUES (?)`, [name]);
  return { id: rows.insertId, name, is_active: true };
}

async function listCounters() {
  return query(
    `SELECT id, name, staff_id, is_active, created_at
     FROM counters
     ORDER BY id DESC`
  );
}

async function listActiveCounters() {
  return query(
    `SELECT id, name, staff_id, is_active, created_at
     FROM counters
     WHERE is_active = TRUE
     ORDER BY id ASC`
  );
}

async function getById(id) {
  const rows = await query(
    `SELECT id, name, staff_id, is_active, created_at
     FROM counters
     WHERE id = ?
     LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

async function getByStaffId(staffId) {
  const rows = await query(
    `SELECT id, name, staff_id, is_active, created_at
     FROM counters
     WHERE staff_id = ?
     LIMIT 1`,
    [staffId]
  );
  return rows[0] || null;
}

async function setActive(id, isActive) {
  const rows = await query(`UPDATE counters SET is_active = ? WHERE id = ?`, [!!isActive, id]);
  return rows.affectedRows > 0;
}

async function assignStaff(counterId, staffId) {
  // MySQL UNIQUE constraint on counters.staff_id will enforce one-to-one.
  const rows = await query(`UPDATE counters SET staff_id = ? WHERE id = ?`, [staffId, counterId]);
  return rows.affectedRows > 0;
}

async function unassignStaff(counterId) {
  const rows = await query(`UPDATE counters SET staff_id = NULL WHERE id = ?`, [counterId]);
  return rows.affectedRows > 0;
}

module.exports = {
  createCounter,
  listCounters,
  listActiveCounters,
  getById,
  getByStaffId,
  setActive,
  assignStaff,
  unassignStaff,
};

