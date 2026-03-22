const sequelize  = require('../config/database');
const Device       = require('./Device');
const DeviceAction = require('./DeviceAction');
const Sensor       = require('./Sensor');
const SensorData   = require('./SensorData');

// ============================================================
// Định nghĩa Associations (quan hệ giữa các bảng)
// ============================================================

// Device → DeviceAction  (1 thiết bị có nhiều lịch sử hành động)
Device.hasMany(DeviceAction, {
    foreignKey: 'deviceID',
    as:         'actions',
});
DeviceAction.belongsTo(Device, {
    foreignKey: 'deviceID',
    as:         'device',
});

// Sensor → SensorData  (1 cảm biến có nhiều bản ghi dữ liệu)
Sensor.hasMany(SensorData, {
    foreignKey: 'SensorID',
    as:         'data',
});
SensorData.belongsTo(Sensor, {
    foreignKey: 'SensorID',
    as:         'sensor',
});

module.exports = {
    sequelize,
    Device,
    DeviceAction,
    Sensor,
    SensorData,
};
