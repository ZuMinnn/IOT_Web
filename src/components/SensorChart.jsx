import { motion } from 'framer-motion';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { getTemperatureEffect, getHumidityEffect, getLightEffect } from '../utils/sensorEffects';

/**
 * Custom tooltip for chart
 */
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-card p-4 border border-white/20">
                <p className="text-white/80 text-sm mb-2">{payload[0].payload.time}</p>
                {payload.map((entry, index) => {
                    let status = 'Normal';
                    if (entry.dataKey === 'temperature') {
                        status = getTemperatureEffect(entry.value).status;
                    } else if (entry.dataKey === 'humidity') {
                        status = getHumidityEffect(entry.value).status;
                    } else if (entry.dataKey === 'light') {
                        status = getLightEffect(entry.value).status;
                    }

                    return (
                        <div key={index} className="flex items-center gap-2 mb-1">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-white text-sm font-medium">
                                {entry.name}: {entry.dataKey === 'temperature' ? Number(entry.value).toFixed(2) : entry.value}
                                {entry.dataKey === 'temperature' && '°C'}
                                {entry.dataKey === 'humidity' && '%'}
                                {entry.dataKey === 'light' && ' lux'}
                            </span>
                            <span className="text-white/60 text-xs">({status})</span>
                        </div>
                    );
                })}
            </div>
        );
    }
    return null;
};

/**
 * Time-series chart for sensor data
 */
export const SensorChart = ({ data }) => {
    return (
        <motion.div
            className="glass-card glass-hover p-3 h-full flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            <h2 className="text-base font-bold text-white mb-2 flex-shrink-0">Lịch sử cảm biến</h2>

            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis
                            dataKey="time"
                            stroke="rgba(255,255,255,0.5)"
                            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                            minTickGap={30}
                        />
                        <YAxis
                            stroke="rgba(255,255,255,0.5)"
                            tick={{ fill: 'rgba(255,255,255,0.7)' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            wrapperStyle={{ color: 'rgba(255,255,255,0.8)' }}
                            iconType="circle"
                        />
                        <Line
                            type="monotone"
                            dataKey="temperature"
                            stroke="#FB923C"
                            strokeWidth={2}
                            dot={{ fill: '#FB923C', r: 3 }}
                            activeDot={{ r: 5 }}
                            name="Nhiệt độ"
                            animationDuration={500}
                        />
                        <Line
                            type="monotone"
                            dataKey="humidity"
                            stroke="#7DD3FC"
                            strokeWidth={2}
                            dot={{ fill: '#7DD3FC', r: 3 }}
                            activeDot={{ r: 5 }}
                            name="Độ ẩm"
                            animationDuration={500}
                        />
                        <Line
                            type="monotone"
                            dataKey="light"
                            stroke="#FDE047"
                            strokeWidth={2}
                            dot={{ fill: '#FDE047', r: 3 }}
                            activeDot={{ r: 5 }}
                            name="Ánh sáng"
                            animationDuration={500}
                            yAxisId={0}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};
