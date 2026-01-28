const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const staffModel = require('../models/staffModel');
const counterModel = require('../models/counterModel');
const { getServerConfig } = require('../config/server');
const queueService = require('../services/queueService');

async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ ok: false, error: { message: 'email and password required' } });

    const staff = await staffModel.findByEmail(email);
    if (!staff) return res.status(401).json({ ok: false, error: { message: 'Invalid credentials' } });

    const ok = await bcrypt.compare(password, staff.password_hash);
    if (!ok) return res.status(401).json({ ok: false, error: { message: 'Invalid credentials' } });

    const { jwtSecret, jwtExpiresIn } = getServerConfig();
    const token = jwt.sign({ id: staff.id, role: staff.role }, jwtSecret, { expiresIn: jwtExpiresIn });

    res.json({
      ok: true,
      token,
      staff: { id: staff.id, name: staff.name, email: staff.email, role: staff.role },
    });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const staff = await staffModel.getById(req.user.id);
    res.json({ ok: true, staff });
  } catch (err) {
    next(err);
  }
}

async function myCounter(req, res, next) {
  try {
    const counter = await counterModel.getByStaffId(req.user.id);
    res.json({ ok: true, counter });
  } catch (err) {
    next(err);
  }
}

async function callNext(req, res, next) {
  try {
    const { counter_id, counterId, service_type, serviceType } = req.body || {};
    let cId = counterId || counter_id;
    if (!cId) {
      const counter = await counterModel.getByStaffId(req.user.id);
      cId = counter ? counter.id : null;
    }

    const ticket = await queueService.callNextTicket({ counterId: cId, serviceType: serviceType || service_type });
    res.json({ ok: true, ticket });
  } catch (err) {
    next(err);
  }
}

module.exports = { login, me, myCounter, callNext };

