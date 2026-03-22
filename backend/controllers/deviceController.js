const { Device, DeviceAction } = require('../models');

// In-memory device state (fallback when DB is empty)
const defaultStates = { fan: false, airConditioner: false, light: false };

// GET /api/v1/devices/status
// Returns current on/off state for each device
const getStatus = async (req, res, next) => {
    try {
        const devices = await Device.findAll();
        const status = { ...defaultStates };

        for (const device of devices) {
            const latest = await DeviceAction.findOne({
                where: { deviceID: device.ID },
                order: [['date', 'DESC']],
            });
            if (latest) {
                status[device.name] = latest.action === 'ON';
            }
        }

        res.json(status);
    } catch (err) {
        next(err);
    }
};

// GET /api/v1/devices/history
// Query params: page, limit, deviceName
const getHistory = async (req, res, next) => {
    try {
        const page   = parseInt(req.query.page)  || 1;
        const limit  = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const deviceWhere = {};
        if (req.query.deviceName) deviceWhere.name = req.query.deviceName;

        const { count, rows } = await DeviceAction.findAndCountAll({
            include: [{ model: Device, as: 'device', where: deviceWhere, attributes: ['name'] }],
            order:  [['date', 'DESC']],
            limit,
            offset,
        });

        res.json({
            total:      count,
            page,
            totalPages: Math.ceil(count / limit),
            data:       rows,
        });
    } catch (err) {
        next(err);
    }
};

// POST /api/v1/devices/control
// Body: { device: 'fan'|'airConditioner'|'light', action: 'ON'|'OFF' }
const control = async (req, res, next) => {
    try {
        const { device: deviceName, action } = req.body;

        if (!deviceName || !action) {
            return res.status(400).json({ error: 'device and action are required' });
        }
        if (!['ON', 'OFF'].includes(action)) {
            return res.status(400).json({ error: 'action must be ON or OFF' });
        }

        const device = await Device.findOne({ where: { name: deviceName } });
        if (!device) {
            return res.status(404).json({ error: `Device "${deviceName}" not found` });
        }

        const log = await DeviceAction.create({
            deviceID: device.ID,
            action,
            status:   'success',
            running:  action === 'ON' ? 1 : 0,
            date:     new Date(),
            createAt: new Date(),
        });

        res.json({ success: true, log });
    } catch (err) {
        next(err);
    }
};

module.exports = { getStatus, getHistory, control };
