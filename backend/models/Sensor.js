const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Model Sensor - khớp với bảng Sensor trong ERD
 * Columns: ID, name, createAt
 */
const Sensor = sequelize.define('Sensor', {
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
    tableName:  'Sensor',
    timestamps: false,
});

module.exports = Sensor;
