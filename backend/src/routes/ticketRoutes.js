const express = require('express');
const ticketController = require('../controllers/ticketController');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/waiting', ticketController.listWaiting);
router.get('/now-serving', ticketController.nowServing);
router.get('/:id', ticketController.getTicket);

// staff-protected transitions
router.put('/:id/call', requireAuth, ticketController.callTicket);
router.put('/:id/serve', requireAuth, ticketController.serveTicket);
router.put('/:id/cancel', requireAuth, ticketController.cancelTicket);

module.exports = router;

