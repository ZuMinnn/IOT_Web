// Sensor thresholds
export const THRESHOLDS = {
    temperature: {
        cold: 20,
        hot: 30,
    },
    humidity: {
        dry: 40,
        wet: 70,
    },
    light: {
        low: 300,
        high: 800,
    },
};

// Sensor ranges for simulation
export const SENSOR_RANGES = {
    temperature: { min: 15, max: 35 },
    humidity: { min: 30, max: 90 },
    light: { min: 100, max: 1200 },
};

// Update interval in milliseconds
export const UPDATE_INTERVAL = 2500;

// Chart data points to keep
export const MAX_DATA_POINTS = 200;

// Color palettes
export const COLORS = {
    temperature: {
        cold: '#60A5FA',
        normal: '#FBBF24',
        hot: '#EF4444',
    },
    humidity: {
        dry: '#E0F2FE',
        normal: '#7DD3FC',
        wet: '#0EA5E9',
    },
    light: {
        dark: '#334155',
        medium: '#FDE047',
        bright: '#FACC15',
    },
};
