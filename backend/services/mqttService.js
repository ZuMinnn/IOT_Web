require('dotenv').config();
const mqtt = require('mqtt');
const { Sensor, SensorData, Device, DeviceAction } = require('../models');
const { pushSensorData, pushDeviceStatus } = require('./websocketService');

// MQTT topics defined in spec
const TOPIC_SENSOR = 'iot/sensor/env';
const TOPIC_DEVICE_CONTROL = 'iot/device/control';
const TOPIC_DEVICE_STATUS = 'iot/device/status';
const TOPIC_DEVICE_SYNC = 'iot/device/request_sync';

let client = null;

function initMqtt() {
    const brokerUrl = `${process.env.MQTT_HOST || 'mqtt://localhost'}`;
    client = mqtt.connect(brokerUrl, {
        port:     parseInt(process.env.MQTT_PORT) || 3636,
        username: process.env.MQTT_USERNAME || undefined,
        password: process.env.MQTT_PASSWORD || undefined,
        reconnectPeriod: 5000,
    });

    client.on('connect', () => {
        console.log('MQTT connected to broker');
        client.subscribe(TOPIC_SENSOR, (err) => {
            if (!err) console.log(`Subscribed to ${TOPIC_SENSOR}`);
        });
        client.subscribe(TOPIC_DEVICE_STATUS, (err) => {
            if (!err) console.log(`Subscribed to ${TOPIC_DEVICE_STATUS}`);
        });
        client.subscribe(TOPIC_DEVICE_SYNC, (err) => {
            if (!err) console.log(`Subscribed to ${TOPIC_DEVICE_SYNC}`);
        });
    });

    client.on('message', async (topic, message) => {
        try {
            if (topic === TOPIC_DEVICE_SYNC) {
                await handleDeviceSync();
                return;
            }

            const payload = JSON.parse(message.toString());

            if (topic === TOPIC_SENSOR) {
                await onSensorData(payload);
            } else if (topic === TOPIC_DEVICE_STATUS) {
                await onDeviceStatus(payload);
            }
        } catch (err) {
            console.error('MQTT message error:', err.message);
        }
    });

    client.on('error', (err) => console.error('MQTT error:', err.message));
}

// Save sensor reading to DB, then push to FE via WebSocket
// Expected payload: { temperature: 25.5, humidity: 60, light: 500 }
async function onSensorData(payload) {
    const sensors = await Sensor.findAll();
    const saved = {};

    for (const sensor of sensors) {
        let value = payload[sensor.name];
        if (value === undefined) continue;

        // Chuẩn hóa lấy tối đa 2 chữ số thập phân
        if (typeof value === 'number') {
            value = Math.round(value * 100) / 100;
        } else if (typeof value === 'string' && !isNaN(parseFloat(value))) {
            value = parseFloat(parseFloat(value).toFixed(2));
        }

        await SensorData.create({ SensorID: sensor.ID, value, date: new Date() });
        saved[sensor.name] = value;
    }

    saved.timestamp = new Date();
    pushSensorData(saved);
}

// Update DeviceAction running field, push device status to FE
// Expected payload: { device: 'fan', is_on: true }
async function onDeviceStatus(payload) {
    const { device: deviceName, is_on } = payload;
    if (!deviceName) return;

    const device = await Device.findOne({ where: { name: deviceName } });
    if (!device) return;

    // Tìm record đang chờ xác nhận từ thiết bị
    const pendingLog = await DeviceAction.findOne({
        where: { deviceID: device.ID, status: 'pending' },
        order: [['date', 'DESC']]
    });

    if (pendingLog) {
        await pendingLog.update({ running: is_on ? 1 : 0, status: 'success' });
    } else {
        // Cập nhật trạng thái mới nhất do ấn nút cứng ở mạch thực tế
        await DeviceAction.update(
            { running: is_on ? 1 : 0 },
            { where: { deviceID: device.ID }, order: [['date', 'DESC']], limit: 1 }
        );
    }

    pushDeviceStatus({ device: deviceName, is_on });
}

// Publish device control command to hardware
// Called by deviceController.control()
function publishDeviceControl(deviceName, action) {
    if (!client || !client.connected) return;
    client.publish(TOPIC_DEVICE_CONTROL, JSON.stringify({ device: deviceName, action }));
}

// Sync physical devices with the last known DB state
// Sync physical devices with the last known DB state
async function handleDeviceSync() {
    console.log('Received hardware sync request, fetching latest DB state...');
    try {
        const devices = await Device.findAll();
        for (const device of devices) {
            // 
            const lastSuccessAction = await DeviceAction.findOne({
                where: { deviceID: device.ID, status: 'success' },
                order: [['date', 'DESC']]
            });
            
            if (lastSuccessAction) {
                const actionStr = lastSuccessAction.action === 'ON' ? 'ON' : 'OFF';
                publishDeviceControl(device.name, actionStr);
                console.log(`Synced ${device.name} -> ${actionStr}`);
                
                // 
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        }
    } catch (err) {
        console.error('Error handling device sync:', err);
    }
}

module.exports = { initMqtt, publishDeviceControl };
