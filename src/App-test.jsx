import { useSensorData } from './hooks/useSensorData';
import { motion } from 'framer-motion';

function App() {
    const { sensorData } = useSensorData();

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-5xl font-bold text-white">IoT Dashboard TEST</h1>
                <p className="text-white/60">Temperature: {sensorData.temperature}°C</p>
                <p className="text-white/60">Humidity: {sensorData.humidity}%</p>
                <p className="text-white/60">Light: {sensorData.light} lux</p>
            </div>
        </div>
    );
}

export default App;
