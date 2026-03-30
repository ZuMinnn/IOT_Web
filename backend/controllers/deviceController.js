const { Op } = require('sequelize');
const { Device, DeviceAction } = require('../models');
const { publishDeviceControl } = require('../services/mqttService');

const defaultStates = { fan: false, airConditioner: false, light: false };

// GET /api/device/status
const getStatus = async (req, res, next) => {
    try {
        const devices = await Device.findAll(); // lay tat ca ban ghi trong bang device
        const status = { ...defaultStates };

        for (const device of devices) {
            // CHỈ lấy bản ghi THÀNH CÔNG gần nhất (bỏ qua các bản ghi pending/failed)
            const latestValid = await DeviceAction.findOne({
                where: { deviceID: device.ID, status: 'success' },
                order: [['date', 'DESC']],
            });
            if (latestValid) status[device.name] = latestValid.action === 'ON';
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
        if (req.query.action && req.query.action !== 'all') {
            const actionParam = req.query.action;
            if (actionParam === 'ON_success') {
                where.action = 'ON';
                where.status = 'success';
            } else if (actionParam === 'OFF_success') {
                where.action = 'OFF';
                where.status = 'success';
            } else if (actionParam === 'error') {
                where.status = 'failed';
            } else if (actionParam === 'ON_failed') {
                where.action = 'ON';
                where.status = 'failed';
            } else if (actionParam === 'OFF_failed') {
                where.action = 'OFF';
                where.status = 'failed';
            } else {
                where.action = actionParam.toUpperCase();
            }
        }

        if (keyword) {
            if (keyword.startsWith('#')) {
                const idSearch = keyword.substring(1);
                where.ID = { [Op.like]: `%${idSearch}%` };
            } else {
                const searchVal = keyword.trim();
                const sequelize = require('../config/database');
                const searchFilters = [
                    { action: { [Op.like]: `%${searchVal}%` } },
                    { status: { [Op.like]: `%${searchVal}%` } },
                    sequelize.where(
                        sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%H:%i:%s %d/%m/%Y'),
                        { [Op.like]: `%${searchVal}%` }
                    ),
                    sequelize.where(
                        sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%H:%i:%s %e/%c/%Y'),
                        { [Op.like]: `%${searchVal}%` }
                    ),
                    sequelize.where(
                        sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%d/%m/%Y %H:%i:%s'),
                        { [Op.like]: `%${searchVal}%` }
                    ),
                    sequelize.where(
                        sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%e/%c/%Y %H:%i:%s'),
                        { [Op.like]: `%${searchVal}%` }
                    )
                ];
                where[Op.or] = searchFilters;
            }
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

        const log = await DeviceAction.create({ //insert into
            deviceID: device.ID,
            action,
            status:   'pending', // save log với trạng thái chờ xử lý
            running:  action === 'ON' ? 1 : 0,
            date:     new Date(),
            createAt: new Date(),
        });

        publishDeviceControl(deviceName, action);

        // time out 5s 
        setTimeout(async () => {
            try {
                const checkLog = await DeviceAction.findByPk(log.ID);
                if (checkLog && checkLog.status === 'pending') {
                    
                    await checkLog.update({ status: 'failed', running: 0 });
                    const { pushDeviceStatus } = require('../services/websocketService');
                    
                    // Lấy ra trạng thái THÀNH CÔNG gần nhất để báo Web cập nhật (Rollback UI)
                    const lastSuccess = await DeviceAction.findOne({
                        where: { deviceID: device.ID, status: 'success' },
                        order: [['date', 'DESC']]
                    });
                    
                    // Nếu lỗi thì phải giữ nguyên trạng thái cũ
                    const realState = lastSuccess ? (lastSuccess.action === 'ON') : false;
                    
                    pushDeviceStatus({ device: deviceName, is_on: realState, error: 'timeout' });
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
