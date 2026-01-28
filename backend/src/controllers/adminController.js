const bcrypt = require('bcryptjs');

const staffModel = require('../models/staffModel');
const counterModel = require('../models/counterModel');
const ticketService = require('../services/ticketService');

async function listStaff(req, res, next) {
  try {
    const staff = await staffModel.listStaff();
    res.json({ ok: true, staff });
  } catch (err) {
    next(err);
  }
}

async function createStaff(req, res, next) {
  try {
    const { name, email, password, role } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ ok: false, error: { message: 'name, email, password required' } });

    const passwordHash = await bcrypt.hash(password, 10);
    const created = await staffModel.createStaff({ name, email, passwordHash, role: role || 'staff' });
    res.status(201).json({ ok: true, staff: created });
  } catch (err) {
    // handle duplicate email (ER_DUP_ENTRY)
    if (err && err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ ok: false, error: { message: 'Email already exists' } });
    }
    next(err);
  }
}

async function deleteStaff(req, res, next) {
  try {
    const id = Number(req.params.id);
    const ok = await staffModel.deleteStaff(id);
    res.json({ ok: true, deleted: ok });
  } catch (err) {
    next(err);
  }
}

async function listCounters(req, res, next) {
  try {
    const counters = await counterModel.listCounters();
    res.json({ ok: true, counters });
  } catch (err) {
    next(err);
  }
}

async function createCounter(req, res, next) {
  try {
    const { name } = req.body || {};
    if (!name) return res.status(400).json({ ok: false, error: { message: 'name required' } });
    const counter = await counterModel.createCounter({ name });
    res.status(201).json({ ok: true, counter });
  } catch (err) {
    next(err);
  }
}

async function openCounter(req, res, next) {
  try {
    const id = Number(req.params.id);
    const ok = await counterModel.setActive(id, true);
    res.json({ ok: true, updated: ok });
  } catch (err) {
    next(err);
  }
}

async function closeCounter(req, res, next) {
  try {
    const id = Number(req.params.id);
    const ok = await counterModel.setActive(id, false);
    res.json({ ok: true, updated: ok });
  } catch (err) {
    next(err);
  }
}

async function assignCounterStaff(req, res, next) {
  try {
    const counterId = Number(req.params.id);
    const { staff_id, staffId } = req.body || {};
    const ok = await counterModel.assignStaff(counterId, staffId || staff_id);
    res.json({ ok: true, updated: ok });
  } catch (err) {
    if (err && err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ ok: false, error: { message: 'Staff already assigned to another counter' } });
    }
    next(err);
  }
}

async function unassignCounterStaff(req, res, next) {
  try {
    const counterId = Number(req.params.id);
    const ok = await counterModel.unassignStaff(counterId);
    res.json({ ok: true, updated: ok });
  } catch (err) {
    next(err);
  }
}

async function queueLength(req, res, next) {
  try {
    const { service_type, serviceType } = req.query || {};
    const n = await ticketService.getQueueLength({ serviceType: serviceType || service_type });
    res.json({ ok: true, queue_length: n });
  } catch (err) {
    next(err);
  }
}

async function avgWaitTime(req, res, next) {
  try {
    const sinceHours = req.query && req.query.since_hours ? Number(req.query.since_hours) : 24;
    const seconds = await ticketService.getAvgWaitTimeSeconds({ sinceHours });
    res.json({ ok: true, avg_wait_seconds: seconds });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listStaff,
  createStaff,
  deleteStaff,
  listCounters,
  createCounter,
  openCounter,
  closeCounter,
  assignCounterStaff,
  unassignCounterStaff,
  queueLength,
  avgWaitTime,
};

