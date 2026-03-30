require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mqtt = require('mqtt');

// Simulator 
const BROKER_URL = process.env.MQTT_HOST || 'mqtt://localhost';
const TOPIC = 'iot/sensor/env';
const INTERVAL_MS = 2000;

const client = mqtt.connect(BROKER_URL, {
    port: parseInt(process.env.MQTT_PORT) || 3636,
    username: process.env.MQTT_USERNAME || 'tranminhvu',
    password: process.env.MQTT_PASSWORD || '123456'
});

client.on('connect', () => {
    console.log(`Dust Simulator connected to MQTT broker - publishing to ${TOPIC} every ${INTERVAL_MS}ms`);

    setInterval(() => {
        // Tạo mức bụi random từ 0 đến 100
        const dustValue = Math.floor(Math.random() * 101);
        
        // MQTT Service cho phép nhận payload độc lập lẻ tẻ
        const payload = JSON.stringify({ dust: dustValue });
        
        client.publish(TOPIC, payload);

        console.log(`[${new Date().toLocaleTimeString()}] Dust published: ${payload}`);
    }, INTERVAL_MS);
});

client.on('error', (err) => {
    console.error('Dust Simulator MQTT error:', err.message);
    process.exit(1);
});
