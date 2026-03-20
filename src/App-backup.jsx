import { useSensorData } from './hooks/useSensorData';
import { Temperature3DBar } from './components/Temperature3DBar';
import { Humidity3DBar } from './components/Humidity3DBar';
import { Light3DBar } from './components/Light3DBar';
import { SensorChart } from './components/SensorChart';
import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  const { sensorData, history } = useSensorData();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Activity size={40} className="text-cyan-400" />
            <h1 className="text-5xl font-bold gradient-text from-cyan-400 to-blue-500">
              IoT Dashboard
            </h1>
          </div>
          <p className="text-white/60 text-lg">
            Real-time Environmental Monitoring System
          </p>
        </motion.header>

        {/* 3D Sensor Bars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Temperature3DBar temperature={sensorData.temperature} />
          <Humidity3DBar humidity={sensorData.humidity} />
          <Light3DBar light={sensorData.light} />
        </div>

        {/* Chart */}
        <SensorChart data={history} />

        {/* Footer */}
        <motion.footer
          className="mt-12 text-center text-white/40 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p>Last updated: {sensorData.timestamp.toLocaleString('vi-VN')}</p>
          <p className="mt-2">Premium IoT Monitoring • Built with React & TailwindCSS</p>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;
