const express = require('express');
const staffController = require('../controllers/staffController');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', staffController.login);

router.get('/me', requireAuth, staffController.me);
router.get('/me/counter', requireAuth, staffController.myCounter);

// staff calls next ticket at their counter (or passed counterId)
router.put('/call-next', requireAuth, requireRole('staff', 'admin'), staffController.callNext);

module.exports = router;

