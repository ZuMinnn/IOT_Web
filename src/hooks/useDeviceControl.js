import { useState, useRef } from 'react';

/**
 * Hook for managing device states
 */
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

    const [deviceHistory, setDeviceHistory] = useState([]);
    const lastIdRef = useRef(0);

    const toggleDevice = (deviceName) => {
        const targetState = !devices[deviceName];

        // Set loading state
        setLoadingStates((prev) => ({
            ...prev,
            [deviceName]: true,
        }));

        // Simulate 1 second delay before actually toggling
        setTimeout(() => {
            setDevices((prev) => ({
                ...prev,
                [deviceName]: targetState,
            }));

            // Log to history
            const newLog = {
                id: ++lastIdRef.current,
                device: deviceName,
                action: targetState ? 'ON' : 'OFF',
                time: new Date().toLocaleString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                })
            };

            setDeviceHistory(prevHistory => [newLog, ...prevHistory]);

            setLoadingStates((prev) => ({
                ...prev,
                [deviceName]: false,
            }));
        }, 1000);
    };

    return {
        devices,
        loadingStates,
        deviceHistory,
        toggleDevice,
    };
};
