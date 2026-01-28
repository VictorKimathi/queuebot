const express = require('express');
const adminController = require('../controllers/adminController');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(requireAuth, requireRole('admin'));

// staff management
router.get('/staff', adminController.listStaff);
router.post('/staff', adminController.createStaff);
router.delete('/staff/:id', adminController.deleteStaff);

// counters management
router.get('/counters', adminController.listCounters);
router.post('/counters', adminController.createCounter);
router.put('/counters/:id/open', adminController.openCounter);
router.put('/counters/:id/close', adminController.closeCounter);
router.put('/counters/:id/assign', adminController.assignCounterStaff);
router.put('/counters/:id/unassign', adminController.unassignCounterStaff);

// stats
router.get('/stats/queue-length', adminController.queueLength);
router.get('/stats/wait-time', adminController.avgWaitTime);

module.exports = router;

