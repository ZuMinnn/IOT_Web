import { useState, useEffect, useRef } from 'react';
import { MAX_DATA_POINTS } from '../utils/constants';

const API_URL = 'http://localhost:3001/api/sensors';
const WS_URL = 'ws://localhost:3001';

export const useSensorData = () => {
    const [sensorData, setSensorData] = useState({
        temperature: 0,
        humidity: 0,
        light: 0,
        timestamp: new Date(),
    });
    
    // History array used EXCLUSIVELY for the Dashboard Chart (max 10 points)
    const [history, setHistory] = useState([]);
    const lastIdRef = useRef(0);

    // Initial load: fetch latest state
    useEffect(() => {
        const fetchInitial = async () => {
            try {
                const res = await fetch(`${API_URL}/latest`);
                const data = await res.json();
                
                const now = new Date();
                const initialData = {
                    temperature: data.temperature || 0,
                    humidity: data.humidity || 0,
                    light: data.light || 0,
                    timestamp: data.timestamp ? new Date(data.timestamp) : now,
                };
                
                setSensorData(initialData);

                // Add to chart history
                setHistory([{
                    id: ++lastIdRef.current,
                    ...initialData,
                    time: now.toLocaleTimeString('vi-VN', {
                        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
                    })
                }]);
            } catch (error) {
                console.error('Failed to fetch initial sensor data:', error);
            }
        };

        fetchInitial();
    }, []);

    // WebSocket for real-time updates
    useEffect(() => {
        const ws = new WebSocket(WS_URL);

        ws.onopen = () => console.log('WebSocket Connected (Sensors)');
        
        ws.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
                
                if (msg.type === 'sensor' && msg.payload) {
                    const pay = msg.payload;
                    const timestamp = new Date(pay.timestamp || new Date());
                    
                    const newData = {
                        temperature: pay.temperature,
                        humidity: pay.humidity,
                        light: pay.light,
                        timestamp
                    };

                    setSensorData(newData);

                    const newId = ++lastIdRef.current;
                    const formattedTime = timestamp.toLocaleTimeString('vi-VN', {
                        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
                    });

                    setHistory((prev) => {
                        const newHistory = [...prev, { id: newId, ...newData, time: formattedTime }];
                        return newHistory.slice(-MAX_DATA_POINTS);
                    });
                }
            } catch (err) {
                console.error('WebSocket message parsing error:', err);
            }
        };

        ws.onclose = () => console.log('WebSocket Disconnected (Sensors)');

        return () => {
            if (ws.readyState === 1) ws.close();
        };
    }, []);

    return { sensorData, history };
};
