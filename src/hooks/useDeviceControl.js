import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/api/device';
const WS_URL = 'ws://localhost:3001';

export const useDeviceControl = () => {
    const [devices, setDevices] = useState({
        fan: false,
        airConditioner: false,
        light: false,
    });

    const [loadingStates, setLoadingStates] = useState({
        fan: false,
        airConditioner: false,
        light: false,
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
                    const { device, is_on } = msg.payload;
                    setDevices((prev) => ({
                        ...prev,
                        [device]: !!is_on
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

        setLoadingStates((prev) => ({ ...prev, [deviceName]: true }));

        try {
            const res = await fetch(`${API_URL}/control`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ device: deviceName, action: targetAction })
            });
            const data = await res.json();
            
            if (data.success) {
                // Optimistic UI update
                setDevices((prev) => ({ ...prev, [deviceName]: targetAction === 'ON' }));
            } else {
                console.error('Failed to toggle device:', data.error);
            }
        } catch (err) {
            console.error('API Error toggling device', err);
        } finally {
            setLoadingStates((prev) => ({ ...prev, [deviceName]: false }));
        }
    };

    return {
        devices,
        loadingStates,
        toggleDevice,
    };
};
