const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');

// GET /api/v1/devices/status - current state of all devices
router.get('/status', deviceController.getStatus);

// GET /api/v1/devices/history - action log with pagination
router.get('/history', deviceController.getHistory);

// POST /api/v1/devices/control - toggle a device on/off
router.post('/control', deviceController.control);

module.exports = router;
