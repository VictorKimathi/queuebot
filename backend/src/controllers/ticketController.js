const ticketService = require('../services/ticketService');

async function listWaiting(req, res, next) {
  try {
    const { service_type, serviceType } = req.query || {};
    const tickets = await ticketService.listWaiting({ serviceType: serviceType || service_type });
    res.json({ ok: true, tickets });
  } catch (err) {
    next(err);
  }
}

async function nowServing(req, res, next) {
  try {
    const ticket = await ticketService.nowServing();
    res.json({ ok: true, ticket });
  } catch (err) {
    next(err);
  }
}

async function getTicket(req, res, next) {
  try {
    const id = Number(req.params.id);
    const ticket = await ticketService.getTicket(id);
    res.json({ ok: true, ticket });
  } catch (err) {
    next(err);
  }
}

async function callTicket(req, res, next) {
  try {
    const ticketId = Number(req.params.id);
    const { counter_id, counterId } = req.body || {};
    const ticket = await ticketService.callTicket({
      ticketId,
      counterId: counterId || counter_id,
    });
    res.json({ ok: true, ticket });
  } catch (err) {
    next(err);
  }
}

async function serveTicket(req, res, next) {
  try {
    const ticketId = Number(req.params.id);
    const ticket = await ticketService.serveTicket({ ticketId });
    res.json({ ok: true, ticket });
  } catch (err) {
    next(err);
  }
}

async function cancelTicket(req, res, next) {
  try {
    const ticketId = Number(req.params.id);
    const ticket = await ticketService.cancelTicket({ ticketId });
    res.json({ ok: true, ticket });
  } catch (err) {
    next(err);
  }
}

module.exports = { listWaiting, nowServing, getTicket, callTicket, serveTicket, cancelTicket };

