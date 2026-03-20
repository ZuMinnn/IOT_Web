import { THRESHOLDS, COLORS } from './constants';

/**
 * Get visual effects for temperature sensor
 * @param {number} temp - Temperature value
 * @returns {object} Effect configuration for 3D bar
 */
export const getTemperatureEffect = (temp) => {
    if (temp < THRESHOLDS.temperature.cold) {
        return {
            color: COLORS.temperature.cold,
            glow: 'shadow-glow-blue',
            status: 'Lạnh',
            gradient: 'from-blue-500/20 to-cyan-500/20',
            barGradient: 'from-blue-400 via-cyan-400 to-cyan-200',
            frost: true,
        };
    } else if (temp > THRESHOLDS.temperature.hot) {
        return {
            color: COLORS.temperature.hot,
            glow: 'shadow-glow-red',
            status: 'Nóng',
            gradient: 'from-red-500/30 to-orange-500/30',
            barGradient: 'from-red-600 via-red-500 to-orange-500',
            heatWave: true,
        };
    } else {
        return {
            color: COLORS.temperature.normal,
            glow: 'shadow-glow-orange',
            status: 'Bình thường',
            gradient: 'from-orange-500/20 to-amber-500/20',
            barGradient: 'from-orange-400 via-orange-300 to-yellow-300',
        };
    }
};

/**
 * Get visual effects for humidity sensor
 * @param {number} humidity - Humidity percentage
 * @returns {object} Effect configuration for 3D bar
 */
export const getHumidityEffect = (humidity) => {
    if (humidity < THRESHOLDS.humidity.dry) {
        return {
            color: COLORS.humidity.dry,
            status: 'Khô',
            gradient: 'from-slate-500/10 to-gray-500/10',
            barGradient: 'from-slate-300 via-gray-300 to-gray-200',
            waterEffect: false,
            waterIntensity: 0,
        };
    } else if (humidity > THRESHOLDS.humidity.wet) {
        return {
            color: COLORS.humidity.wet,
            status: 'Ẩm ướt',
            gradient: 'from-blue-600/30 to-indigo-600/30',
            barGradient: 'from-blue-500 via-indigo-500 to-purple-500',
            waterEffect: true,
            waterIntensity: 1.2,
        };
    } else {
        return {
            color: COLORS.humidity.normal,
            status: 'Bình thường',
            gradient: 'from-cyan-500/20 to-sky-500/20',
            barGradient: 'from-cyan-400 via-sky-400 to-blue-400',
            waterEffect: true,
            waterIntensity: 0.6,
        };
    }
};

/**
 * Get visual effects for light sensor
 * @param {number} lux - Light value in lux
 * @returns {object} Effect configuration for 3D bar
 */
export const getLightEffect = (lux) => {
    if (lux < THRESHOLDS.light.low) {
        return {
            color: COLORS.light.dark,
            status: 'Tối',
            gradient: 'from-slate-800/20 to-black/20',
            barGradient: 'from-slate-600 via-slate-700 to-gray-800',
            rays: false,
            rayCount: 0,
        };
    } else if (lux > THRESHOLDS.light.high) {
        return {
            color: COLORS.light.bright,
            status: 'Sáng',
            gradient: 'from-yellow-400/30 to-orange-400/30',
            barGradient: 'from-yellow-300 via-amber-300 to-orange-400',
            glow: 'shadow-glow-yellow',
            rays: true,
            rayCount: 12,
        };
    } else {
        return {
            color: COLORS.light.medium,
            status: 'Trung bình',
            gradient: 'from-yellow-500/20 to-amber-500/20',
            barGradient: 'from-yellow-400 via-yellow-300 to-amber-200',
            rays: true,
            rayCount: 8,
        };
    }
};

/**
 * Get chart line color based on value and thresholds
 * @param {number} value - Sensor value
 * @param {string} type - Sensor type
 * @returns {string} Color hex code
 */
export const getChartColor = (value, type) => {
    switch (type) {
        case 'temperature':
            return getTemperatureEffect(value).color;
        case 'humidity':
            return getHumidityEffect(value).color;
        case 'light':
            return getLightEffect(value).color;
        default:
            return '#ffffff';
    }
};

