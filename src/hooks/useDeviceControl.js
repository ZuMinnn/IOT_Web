import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/api/device';
const WS_URL = 'ws://localhost:3001';

export const useDeviceControl = () => {
    const [devices, setDevices] = useState({
        fan: false,
        airConditioner: false,
        light: false,
        warningLight: false,
    });

    const [loadingStates, setLoadingStates] = useState({
        fan: false,
        airConditioner: false,
        light: false,
        warningLight: false,
    });

    // 1. Fetch initial status
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch(`${API_URL}/status`);
                const data = await res.json();
                setDevices({
                    fan: !!data.fan,
                    airConditioner: !!data.airConditioner,
                    light: !!data.light,
                    warningLight: !!data.warningLight,
                });
            } catch (err) {
                console.error('Failed to fetch initial device status', err);
            }
        };
        fetchStatus();
    }, []);

    // 2. WebSocket listener for device status updates from backend
    useEffect(() => {
        const ws = new WebSocket(WS_URL);

        ws.onopen = () => console.log('WebSocket Connected (Devices)');
        
        ws.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
                if (msg.type === 'device' && msg.payload) {
                    const { device, is_on, error, isBlinking } = msg.payload;
                    
                    if (error === 'timeout') {
                        alert(`Thiết bị ${device} không phản hồi! (Timeout)`);
                        setLoadingStates((prev) => ({
                            ...prev,
                            [device]: false
                        }));
                        return;
                    }

                    setDevices((prev) => ({
                        ...prev,
                        [device]: !!is_on
                    }));
                    // Tắt trạng thái pending khi phần cứng xác nhận
                    setLoadingStates((prev) => ({
                        ...prev,
                        [device]: false
                    }));
                }
            } catch (err) {}
        };

        ws.onclose = () => console.log('WebSocket Disconnected (Devices)');

        return () => {
            if (ws.readyState === 1) ws.close();
        };
    }, []);

    // 3. Toggle device action
    const toggleDevice = async (deviceName) => {
        const targetAction = !devices[deviceName] ? 'ON' : 'OFF';

        // Bật trạng thái pending (sẽ chờ VĨNH VIỄN cho đến khi phần cứng gửi lại JSON qua MQTT)
        setLoadingStates((prev) => ({ ...prev, [deviceName]: true }));

        try {
            const res = await fetch(`${API_URL}/control`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ device: deviceName, action: targetAction })
            });
            const data = await res.json();
            
            if (!data.success) {
                console.error('Failed to toggle device:', data.error);
                // Chỉ tắt pending nếu backend trả về lỗi ngay lập tức
                setLoadingStates((prev) => ({ ...prev, [deviceName]: false }));
            }
            // Không cập nhật UI (không optimistic update). UI sẽ chỉ cập nhật khi WebSocket nhận được dữ liệu.
        } catch (err) {
            console.error('API Error toggling device', err);
            // Tắt pending nếu mất kết nối tới Backend API
            setLoadingStates((prev) => ({ ...prev, [deviceName]: false }));
        }
    };

    return {
        devices,
        loadingStates,
        toggleDevice,
    };
};
