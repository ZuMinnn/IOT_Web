const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Model Device - khớp với bảng Device trong ERD
 * Columns: ID, name, createAt
 */
const Device = sequelize.define('Device', {
    ID: {
        type:          DataTypes.INTEGER(10),
        autoIncrement: true,
        primaryKey:    true,
    },
    name: {
        type:      DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    createAt: {
        type:         DataTypes.DATE,
        allowNull:    false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName:  'Device',
    timestamps: false,
});

module.exports = Device;
