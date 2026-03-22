const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');

// GET /api/v1/sensors/realtime - latest reading for each sensor
router.get('/realtime', sensorController.getRealtime);

// GET /api/v1/sensors/history - paginated history with optional filters
router.get('/history', sensorController.getHistory);

module.exports = router;
