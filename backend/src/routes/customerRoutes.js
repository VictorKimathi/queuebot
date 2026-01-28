const express = require('express');
const customerController = require('../controllers/customerController');

const router = express.Router();

// Customer joins queue (creates customer + ticket)
router.post('/join', customerController.joinQueue);

// Ticket status + queue position (convenience endpoints under customers)
router.get('/tickets/:ticketId/status', customerController.getTicketStatus);
router.get('/tickets/:ticketId/position', customerController.getQueuePosition);

module.exports = router;

