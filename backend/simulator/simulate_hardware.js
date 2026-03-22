require('dotenv').config();
const mqtt = require('mqtt');
const readline = require('readline');

// 1. Cấu hình kết nối MQTT
const brokerUrl = process.env.MQTT_HOST || 'mqtt://172.20.10.4';
const options = {
    port: parseInt(process.env.MQTT_PORT) || 3636,
    username: process.env.MQTT_USERNAME || 'tranminhvu',
    password: process.env.MQTT_PASSWORD || '123456'
};

const client = mqtt.connect(brokerUrl, options);

// 2. Biến lưu trạng thái giả lập của các thiết bị (Mặc định OFF)
const devices = {
    fan: false,
    light: false,
    airConditioner: false
};

// 3. Cấu hình giao diện dòng lệnh (CLI)
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function drawMenu() {
    console.clear();
    console.log('=============================================');
    console.log(' PHẦN MỀM GIẢ LẬP MẠCH ESP8266 (MQTT) CLI');
    console.log(` Trạng thái kết nối: ${client.connected ? 'Kết nối thành công (xanh)' : 'Đang tìm Backend (đỏ)'}`);
    console.log('=============================================');
    console.log('   TRẠNG THÁI THIẾT BỊ TRÊN MẠCH (GIẢ LẬP):');
    console.log(`   [1] Quạt (fan)          : ${devices.fan ? '🟢 BẬT (ON)' : '🔴 TẮT (OFF)'}`);
    console.log(`   [2] Đèn (light)         : ${devices.light ? '🟢 BẬT (ON)' : '🔴 TẮT (OFF)'}`);
    console.log(`   [3] Điều hòa (airCond)  : ${devices.airConditioner ? '🟢 BẬT (ON)' : '🔴 TẮT (OFF)'}`);
    console.log('---------------------------------------------');
    console.log('   PHÍM TẮT ĐIỀU KHIỂN (Bấm số rồi ấn Enter):');
    console.log('   [1-3] : Bật/Tắt thiết bị tương ứng');
    console.log('   [0]   : Thoát chương trình');
    console.log('=============================================');
    
    rl.question(' Nhập số thao tác: ', handleInput);
}

function publishStatus(deviceName) {
    const is_on = devices[deviceName];
    const payload = JSON.stringify({ device: deviceName, is_on });
    
    // Gửi tin nhắn Retained lên Topic
    client.publish('iot/device/status', payload, { qos: 0, retain: true }, (err) => {
        if (err) {
            console.log(`\n Lỗi khi gửi lệnh cho ${deviceName}:`, err);
        } else {
            console.log(`\n Thành công! ESP vừa bắn tin MQTT: [${deviceName}] -> [${is_on ? 'ON' : 'OFF'}] (Có lưu vết)`);
        }
        
        // Tạm dừng 1.5 giây để bạn đọc được dòng thông báo trên, rồi vẽ lại Menu
        setTimeout(drawMenu, 1500); 
    });
}

function handleInput(choice) {
    choice = choice.trim();
    switch (choice) {
        case '1':
            devices.fan = !devices.fan;
            publishStatus('fan');
            break;
        case '2':
            devices.light = !devices.light;
            publishStatus('light');
            break;
        case '3':
            devices.airConditioner = !devices.airConditioner;
            publishStatus('airConditioner');
            break;
        case '0':
            console.log('\nĐang ngắt kết nối MQTT... Tạm biệt nha!');
            client.end();
            rl.close();
            process.exit(0);
            break;
        default:
            console.log('\n Lựa chọn không hợp lệ, vui lòng nhập lại số 0, 1, 2, 3!');
            setTimeout(drawMenu, 1500);
            break;
    }
}

// Bắt đầu ứng dụng khi kết nối thành công
client.on('connect', () => {
    drawMenu();
});

// Xử lý lỗi do sai Server
client.on('error', (err) => {
    console.log('\nLỗi kết nối cấu hình ESP tới MQTT Server:', err.message);
    process.exit(1);
});
