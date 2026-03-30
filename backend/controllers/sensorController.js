const { Sensor, SensorData } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// GET /api/sensors/latest
// Returns the most recent value for each sensor (temperature, humidity, light)
const getLatest = async (req, res, next) => {
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

// GET /api/sensors/history
// Query params: page, limit, sensorName, startDate, endDate, sortBy, sortDir, keyword
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

        if (req.query.keyword) {
            if (req.query.keyword.startsWith('#')) {
                const idSearch = req.query.keyword.substring(1);
                where.ID = { [Op.like]: `%${idSearch}%` };
            } else {
                let searchVal = req.query.keyword.trim();
                const searchFilters = [];
                
                if (!isNaN(searchVal) && searchVal !== '') {
                    searchFilters.push(
                        sequelize.where(
                            sequelize.cast(sequelize.fn('ROUND', sequelize.col('SensorData.value'), 2), 'CHAR'), 
                            { [Op.like]: `${Number(searchVal)}%` }
                        )
                    );
                } else {
                    searchFilters.push({ value: { [Op.like]: `%${searchVal}%` } });
                }

                // Hỗ trợ tìm dạng chuỗi thời gian như 14:39:33 30/3/2026
                searchFilters.push(
                    sequelize.where(
                        sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%H:%i:%s %d/%m/%Y'),
                        { [Op.like]: `%${searchVal}%` }
                    )
                );
                searchFilters.push(
                    sequelize.where(
                        sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%H:%i:%s %e/%c/%Y'),
                        { [Op.like]: `%${searchVal}%` }
                    )
                );
                searchFilters.push(
                    sequelize.where(
                        sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%d/%m/%Y %H:%i:%s'),
                        { [Op.like]: `%${searchVal}%` }
                    )
                );
                searchFilters.push(
                    sequelize.where(
                        sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%e/%c/%Y %H:%i:%s'),
                        { [Op.like]: `%${searchVal}%` }
                    )
                );

                where[Op.or] = searchFilters;
            }
        }

        const sensorWhere = {};
        if (req.query.sensorName && req.query.sensorName !== 'all') {
            sensorWhere.name = req.query.sensorName;
        }

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

module.exports = { getLatest, getHistory };

