const { query } = require('../config/db');

async function findLatestByPhone(phoneNumber) {
  if (!phoneNumber) return null;
  const rows = await query(
    `SELECT id, name, phone_number, created_at
     FROM customers
     WHERE phone_number = ?
     ORDER BY id DESC
     LIMIT 1`,
    [phoneNumber]
  );
  return rows[0] || null;
}

async function createCustomer({ name, phoneNumber }) {
  const rows = await query(
    `INSERT INTO customers (name, phone_number)
     VALUES (?, ?)`,
    [name, phoneNumber || null]
  );
  return { id: rows.insertId, name, phone_number: phoneNumber || null };
}

async function getCustomerById(id) {
  const rows = await query(
    `SELECT id, name, phone_number, created_at
     FROM customers
     WHERE id = ?
     LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

module.exports = {
  findLatestByPhone,
  createCustomer,
  getCustomerById,
};

