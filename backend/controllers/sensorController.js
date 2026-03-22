const { Sensor, SensorData } = require('../models');
const { Op } = require('sequelize');

// GET /api/v1/sensors/realtime
// Returns latest value for each sensor (temperature, humidity, light)
const getRealtime = async (req, res, next) => {
    try {
        const sensors = await Sensor.findAll();
        const result = {};

        for (const sensor of sensors) {
            const latest = await SensorData.findOne({
                where: { SensorID: sensor.ID },
                order: [['date', 'DESC']],
            });
            result[sensor.name] = latest ? latest.value : null;
        }

        result.timestamp = new Date();
        res.json(result);
    } catch (err) {
        next(err);
    }
};

// GET /api/v1/sensors/history
// Query params: page, limit, sensorName, startDate, endDate, sortBy, sortDir
const getHistory = async (req, res, next) => {
    try {
        const page     = parseInt(req.query.page)    || 1;
        const limit    = parseInt(req.query.limit)   || 10;
        const sortBy   = req.query.sortBy  || 'date';
        const sortDir  = req.query.sortDir || 'DESC';
        const offset   = (page - 1) * limit;

        const where = {};
        if (req.query.startDate) where.date = { [Op.gte]: new Date(req.query.startDate) };
        if (req.query.endDate)   where.date = { ...where.date, [Op.lte]: new Date(req.query.endDate) };

        const sensorWhere = {};
        if (req.query.sensorName) sensorWhere.name = req.query.sensorName;

        const { count, rows } = await SensorData.findAndCountAll({
            where,
            include: [{ model: Sensor, as: 'sensor', where: sensorWhere, attributes: ['name'] }],
            order:  [[sortBy, sortDir.toUpperCase()]],
            limit,
            offset,
        });

        res.json({
            total:       count,
            page,
            totalPages:  Math.ceil(count / limit),
            data:        rows,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { getRealtime, getHistory };
