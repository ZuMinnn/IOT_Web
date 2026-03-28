const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Model DeviceAction 
 * Columns: ID, deviceID (FK→Device), action, status, running, date, createAt
 */
const DeviceAction = sequelize.define('DeviceAction', {
    ID: {
        type:          DataTypes.INTEGER(10),
        autoIncrement: true,
        primaryKey:    true,
    },
    deviceID: {
        type:      DataTypes.INTEGER(10),
        allowNull: false,
        references: {
            model: 'Device',
            key:   'ID',
        },
    },
    action: {
        type:      DataTypes.STRING(255),
        allowNull: false,
        validate: {
            isIn: [['ON', 'OFF']],
        },
    },
    status: {
        type:         DataTypes.STRING(255),
        allowNull:    false,
        defaultValue: 'success',
        validate: {
            isIn: [['success', 'failed', 'pending']],
        },
    },
    running: {
        type:         DataTypes.INTEGER(10),
        allowNull:    false,
        defaultValue: 0,
        comment:      '1 = đang chạy, 0 = đã dừng',
    },
    date: {
        type:         DataTypes.DATE,
        allowNull:    false,
        defaultValue: DataTypes.NOW,
    },
    createAt: {
        type:         DataTypes.DATE,
        allowNull:    false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName:  'DeviceAction',
    timestamps: false,
});

module.exports = DeviceAction;
