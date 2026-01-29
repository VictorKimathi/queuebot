const { withTransaction, query } = require('../config/db');
const customerModel = require('../models/customerModel');
const ticketModel = require('../models/ticketModel');

function httpError(status, message, extra = {}) {
  const err = new Error(message);
  err.status = status;
  err.expose = true;
  Object.assign(err, extra);
  return err;
}

async function joinQueue({ name, phoneNumber, serviceType, priority }) {
  if (!name || !serviceType) throw httpError(400, 'name and service_type are required');

  return withTransaction((db) => {
    // create customer
    const custStmt = db.prepare(`INSERT INTO customers (name, phone_number) VALUES (?, ?)`);
    const custInfo = custStmt.run(name, phoneNumber || null);
    const customerId = custInfo.lastInsertRowid;

    // create ticket (ticket_number will be set to id for a guaranteed unique sequence)
    const ticketStmt = db.prepare(
      `INSERT INTO tickets (customer_id, ticket_number, service_type, priority) VALUES (?, ?, ?, ?)`
    );
    const ticketInfo = ticketStmt.run(customerId, 0, serviceType, Number(priority || 0));
    const ticketId = ticketInfo.lastInsertRowid;

    // Update ticket_number to match id
    db.prepare(`UPDATE tickets SET ticket_number = ? WHERE id = ?`).run(ticketId, ticketId);

    // Return the ticket
    const ticket = db.prepare(`SELECT * FROM tickets WHERE id = ?`).get(ticketId);
    return ticket;
  });
}

async function listWaiting({ serviceType } = {}) {
  return ticketModel.listWaitingTickets({ serviceType });
}

async function nowServing() {
  return ticketModel.nowServing();
}

async function getTicket(id) {
  const ticket = await ticketModel.getTicketById(id);
  if (!ticket) throw httpError(404, 'Ticket not found');
  return ticket;
}

async function getTicketStatus(ticketId) {
  const ticket = await getTicket(ticketId);

  let ahead = 0;
  if (ticket.status === 'waiting') {
    const count = await ticketModel.getQueueAheadCount(ticketId);
    ahead = count == null ? 0 : count;
  }

  return { ticket, ahead };
}

async function callTicket({ ticketId, counterId }) {
  return withTransaction((db) => {
    const row = db.prepare(`SELECT id, status FROM tickets WHERE id = ?`).get(ticketId);
    if (!row) throw httpError(404, 'Ticket not found');
    if (row.status !== 'waiting') throw httpError(409, `Ticket is not waiting (status=${row.status})`);

    db.prepare(
      `UPDATE tickets SET status = 'called', counter_id = ?, called_at = CURRENT_TIMESTAMP WHERE id = ?`
    ).run(counterId || null, ticketId);

    return db.prepare(`SELECT * FROM tickets WHERE id = ?`).get(ticketId);
  });
}

async function serveTicket({ ticketId }) {
  return withTransaction((db) => {
    const row = db.prepare(`SELECT id, status FROM tickets WHERE id = ?`).get(ticketId);
    if (!row) throw httpError(404, 'Ticket not found');
    if (row.status !== 'called') throw httpError(409, `Ticket is not called (status=${row.status})`);

    db.prepare(
      `UPDATE tickets SET status = 'served', served_at = CURRENT_TIMESTAMP WHERE id = ?`
    ).run(ticketId);

    return db.prepare(`SELECT * FROM tickets WHERE id = ?`).get(ticketId);
  });
}

async function cancelTicket({ ticketId }) {
  return withTransaction((db) => {
    const row = db.prepare(`SELECT id, status FROM tickets WHERE id = ?`).get(ticketId);
    if (!row) throw httpError(404, 'Ticket not found');
    if (row.status === 'served') throw httpError(409, 'Cannot cancel a served ticket');

    db.prepare(`UPDATE tickets SET status = 'cancelled' WHERE id = ?`).run(ticketId);
    return db.prepare(`SELECT * FROM tickets WHERE id = ?`).get(ticketId);
  });
}

async function callNext({ counterId, serviceType }) {
  return withTransaction((db) => {
    // Find next waiting ticket
    let sql = `SELECT id FROM tickets WHERE status = 'waiting'`;
    const params = [];
    if (serviceType) {
      sql += ` AND service_type = ?`;
      params.push(serviceType);
    }
    sql += ` ORDER BY priority DESC, created_at ASC LIMIT 1`;

    const next = db.prepare(sql).get(...params);
    if (!next) return null;

    db.prepare(
      `UPDATE tickets SET status = 'called', counter_id = ?, called_at = CURRENT_TIMESTAMP WHERE id = ?`
    ).run(counterId || null, next.id);

    return db.prepare(`SELECT * FROM tickets WHERE id = ?`).get(next.id);
  });
}

async function getQueueLength({ serviceType } = {}) {
  if (serviceType) {
    const rows = await query(
      `SELECT COUNT(*) AS n FROM tickets WHERE status = 'waiting' AND service_type = ?`,
      [serviceType]
    );
    return Number(rows[0].n || 0);
  }
  const rows = await query(`SELECT COUNT(*) AS n FROM tickets WHERE status = 'waiting'`);
  return Number(rows[0].n || 0);
}

async function getAvgWaitTimeSeconds({ sinceHours = 24 } = {}) {
  const rows = await query(
    `SELECT AVG(TIMESTAMPDIFF(SECOND, created_at, served_at)) AS avg_seconds
     FROM tickets
     WHERE status = 'served'
       AND served_at IS NOT NULL
       AND served_at >= (NOW() - INTERVAL ? HOUR)`,
    [Number(sinceHours)]
  );
  const val = rows[0] ? rows[0].avg_seconds : null;
  return val == null ? null : Number(val);
}

module.exports = {
  joinQueue,
  listWaiting,
  nowServing,
  getTicket,
  getTicketStatus,
  callTicket,
  serveTicket,
  cancelTicket,
  callNext,
  getQueueLength,
  getAvgWaitTimeSeconds,
};

