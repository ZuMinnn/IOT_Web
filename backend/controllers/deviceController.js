const { Op } = require('sequelize');
const { Device, DeviceAction } = require('../models');
const { publishDeviceControl } = require('../services/mqttService');

const defaultStates = { fan: false, airConditioner: false, light: false };

// GET /api/device/status
const getStatus = async (req, res, next) => {
    try {
        const devices = await Device.findAll();
        const status = { ...defaultStates };

        for (const device of devices) {
            const latest = await DeviceAction.findOne({
                where: { deviceID: device.ID },
                order: [['date', 'DESC']],
            });
            if (latest) status[device.name] = latest.action === 'ON';
        }

        res.json(status);
    } catch (err) {
        next(err);
    }
};

// GET /api/device-actions
// Query: page, limit, keyword, fromDate, toDate
const getHistory = async (req, res, next) => {
    try {
        const page     = parseInt(req.query.page)  || 1;
        const limit    = parseInt(req.query.limit) || 10;
        const offset   = (page - 1) * limit;
        const keyword    = req.query.keyword  || '';
        const deviceName = req.query.deviceName || '';
        const fromDate   = req.query.fromDate || null;
        const toDate     = req.query.toDate   || null;

        const where = {};
        if (fromDate || toDate) {
            where.date = {};
            if (fromDate) where.date[Op.gte] = new Date(fromDate);
            if (toDate)   where.date[Op.lte] = new Date(toDate);
        }
        if (keyword) {
            where[Op.or] = [
                { action: { [Op.like]: `%${keyword}%` } },
                { status: { [Op.like]: `%${keyword}%` } },
            ];
        }

        const deviceWhere = {};
        if (deviceName) {
            deviceWhere.name = deviceName;
        }

        const { count, rows } = await DeviceAction.findAndCountAll({
            where,
            include: [{ model: Device, as: 'device', attributes: ['name'], where: deviceName ? deviceWhere : undefined }],
            order:  [['date', 'DESC']],
            limit,
            offset,
        });

        res.json({ total: count, page, totalPages: Math.ceil(count / limit), data: rows });
    } catch (err) {
        next(err);
    }
};

// POST /api/device/control
// Body: { device, action: 'ON'|'OFF' }
// Step 3 spec: saveControlLog -> Step 4: publish MQTT iot/device/control
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
            status:   'pending', // Lưu trạng thái chờ
            running:  action === 'ON' ? 1 : 0,
            date:     new Date(),
            createAt: new Date(),
        });

        publishDeviceControl(deviceName, action);

        // Hẹn giờ check mạch phần cứng (Time out 5 giây)
        setTimeout(async () => {
            try {
                const checkLog = await DeviceAction.findByPk(log.ID);
                if (checkLog && checkLog.status === 'pending') {
                    // Nếu 5s sau vẫn chờ -> Đánh lỗi
                    await checkLog.update({ status: 'failed', running: 0 });
                    const { pushDeviceStatus } = require('../services/websocketService');
                    // Bắn Socket về Frontend để tắt vòng xoay
                    pushDeviceStatus({ device: deviceName, error: 'timeout' });
                }
            } catch (err) {
                console.error("Lỗi Timeout check", err);
            }
        }, 5000);

        res.json({ success: true, log });
    } catch (err) {
        next(err);
    }
};

module.exports = { getStatus, getHistory, control };
