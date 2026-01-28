const ticketService = require('../services/ticketService');

async function joinQueue(req, res, next) {
  try {
    const { name, phone_number, phoneNumber, service_type, serviceType, priority } = req.body || {};
    const ticket = await ticketService.joinQueue({
      name,
      phoneNumber: phoneNumber || phone_number,
      serviceType: serviceType || service_type,
      priority,
    });
    res.status(201).json({ ok: true, ticket });
  } catch (err) {
    next(err);
  }
}

async function getTicketStatus(req, res, next) {
  try {
    const ticketId = Number(req.params.ticketId);
    const status = await ticketService.getTicketStatus(ticketId);
    res.json({ ok: true, ...status });
  } catch (err) {
    next(err);
  }
}

async function getQueuePosition(req, res, next) {
  try {
    const ticketId = Number(req.params.ticketId);
    const { ahead, ticket } = await ticketService.getTicketStatus(ticketId);
    res.json({ ok: true, ticket_id: ticketId, ahead, status: ticket.status });
  } catch (err) {
    next(err);
  }
}

module.exports = { joinQueue, getTicketStatus, getQueuePosition };

