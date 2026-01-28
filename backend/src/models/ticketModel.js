const { query } = require('../config/db');

async function getTicketById(id) {
  const rows = await query(
    `SELECT 
        t.id,
        t.customer_id,
        t.ticket_number,
        t.service_type,
        t.status,
        t.priority,
        t.counter_id,
        t.created_at,
        t.called_at,
        t.served_at,
        c.name AS customer_name,
        c.phone_number AS customer_phone,
        co.name AS counter_name
     FROM tickets t
     JOIN customers c ON c.id = t.customer_id
     LEFT JOIN counters co ON co.id = t.counter_id
     WHERE t.id = ?
     LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

async function listWaitingTickets({ serviceType } = {}) {
  if (serviceType) {
    return query(
      `SELECT id, customer_id, ticket_number, service_type, status, priority, counter_id, created_at
       FROM tickets
       WHERE status = 'waiting' AND service_type = ?
       ORDER BY priority DESC, created_at ASC`,
      [serviceType]
    );
  }
  return query(
    `SELECT id, customer_id, ticket_number, service_type, status, priority, counter_id, created_at
     FROM tickets
     WHERE status = 'waiting'
     ORDER BY priority DESC, created_at ASC`
  );
}

async function nowServing() {
  const rows = await query(
    `SELECT id, customer_id, ticket_number, service_type, status, priority, counter_id, created_at, called_at
     FROM tickets
     WHERE status = 'called'
     ORDER BY called_at DESC
     LIMIT 1`
  );
  return rows[0] || null;
}

async function getQueueAheadCount(ticketId) {
  const rows = await query(
    `SELECT (
        SELECT COUNT(*)
        FROM tickets t2
        WHERE t2.status = 'waiting'
          AND (
            t2.priority > t1.priority OR
            (t2.priority = t1.priority AND t2.created_at < t1.created_at)
          )
      ) AS ahead
     FROM tickets t1
     WHERE t1.id = ?
     LIMIT 1`,
    [ticketId]
  );
  if (!rows[0]) return null;
  return Number(rows[0].ahead || 0);
}

module.exports = {
  getTicketById,
  listWaitingTickets,
  nowServing,
  getQueueAheadCount,
};

