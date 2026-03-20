import { useState, useEffect, useRef } from 'react';
import { SENSOR_RANGES, UPDATE_INTERVAL, MAX_DATA_POINTS } from '../utils/constants';

/**
 * Generate a random value within a range with smooth transitions
 */
const generateValue = (min, max, prevValue) => {
    // If no previous value, generate random value
    if (prevValue === undefined) {
        return Math.random() * (max - min) + min;
    }

    // Generate value close to previous value for smooth transitions
    const maxChange = (max - min) * 0.1; // Max 10% change per update
    const change = (Math.random() - 0.5) * maxChange * 2;
    const newValue = prevValue + change;

    // Clamp to range
    return Math.max(min, Math.min(max, newValue));
};

/**
 * Custom hook for managing real-time sensor data
 * @returns {object} Sensor data and history
 */
export const useSensorData = () => {
    // 1. Define initial data once
    const initialTimestamp = new Date();
    const initialData = {
        temperature: 25,
        humidity: 55,
        light: 500,
        timestamp: initialTimestamp,
    };

    // 2. Initialize State with this single source of truth
    const [sensorData, setSensorData] = useState(initialData);

    // 3. Initialize History with the same data, ensuring ID #1 exists correctly
    const [history, setHistory] = useState([{
        id: 1,
        ...initialData,
        time: initialTimestamp.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }),
    }]);

    const prevValuesRef = useRef({
        temperature: initialData.temperature,
        humidity: initialData.humidity,
        light: initialData.light
    });

    const lastIdRef = useRef(1); // Start at 1 because we already have ID 1

    useEffect(() => {
        const updateSensorData = () => {
            const timestamp = new Date();

            const newData = {
                temperature: parseFloat(
                    generateValue(
                        SENSOR_RANGES.temperature.min,
                        SENSOR_RANGES.temperature.max,
                        prevValuesRef.current.temperature
                    ).toFixed(1)
                ),
                humidity: parseFloat(
                    generateValue(
                        SENSOR_RANGES.humidity.min,
                        SENSOR_RANGES.humidity.max,
                        prevValuesRef.current.humidity
                    ).toFixed(1)
                ),
                light: Math.round(
                    generateValue(
                        SENSOR_RANGES.light.min,
                        SENSOR_RANGES.light.max,
                        prevValuesRef.current.light
                    )
                ),
                timestamp,
            };

            // Store current values for next update
            prevValuesRef.current = {
                temperature: newData.temperature,
                humidity: newData.humidity,
                light: newData.light,
            };

            setSensorData(newData);

            // Assign ID
            const newId = ++lastIdRef.current;
            const formattedTime = timestamp.toLocaleString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            });

            // Update history
            setHistory((prev) => {
                const newHistory = [
                    ...prev,
                    {
                        id: newId,
                        ...newData,
                        time: formattedTime,
                    },
                ];

                // Keep only last MAX_DATA_POINTS entries
                return newHistory.slice(-MAX_DATA_POINTS);
            });
        };

        // Set up interval
        const interval = setInterval(updateSensorData, UPDATE_INTERVAL);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return { sensorData, history };
};
