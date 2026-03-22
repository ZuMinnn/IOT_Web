const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Model SensorData - khớp với bảng SensorData trong ERD
 * Columns: ID, SensorID (FK→Sensor), value, date
 */
const SensorData = sequelize.define('SensorData', {
    ID: {
        type:          DataTypes.INTEGER(10),
        autoIncrement: true,
        primaryKey:    true,
    },
    SensorID: {
        type:      DataTypes.INTEGER(10),
        allowNull: false,
        references: {
            model: 'Sensor',
            key:   'ID',
        },
    },
    value: {
        type:      DataTypes.DOUBLE(10, 2),
        allowNull: false,
    },
    date: {
        type:         DataTypes.DATE,
        allowNull:    false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName:  'SensorData',
    timestamps: false,
});

module.exports = SensorData;
