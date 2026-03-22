import { useState } from 'react';
import { useSensorData } from './hooks/useSensorData';
import { useDeviceControl } from './hooks/useDeviceControl';
import { Temperature3DBar } from './components/Temperature3DBar';
import { Humidity3DBar } from './components/Humidity3DBar';
import { Light3DBar } from './components/Light3DBar';
import { DeviceCard } from './components/DeviceCard';
import { SensorChart } from './components/SensorChart';
import { SensorHistory } from './components/SensorHistory';
import { DeviceHistory } from './components/DeviceHistory';
import { Profile } from './components/Profile';
import { Settings } from './components/Settings';
import { Activity, Fan, Wind, Lightbulb, Menu, X, Home, User, Database, ClipboardList, Settings as SettingsIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { sensorData, history } = useSensorData();
  const { devices, loadingStates, toggleDevice } = useDeviceControl();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const handleNavigation = (view) => {
    setCurrentView(view);
    closeMenu();
  };

  return (
    <div className="h-screen p-2 lg:p-3 overflow-hidden bg-[#0f172a]">
      <div className="max-w-[1800px] mx-auto h-full flex flex-col relative">
        {/* Menu Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMenu}
          className="absolute top-2 left-2 z-50 p-2 rounded-xl bg-white/5 border border-white/10 text-cyan-400 hover:bg-white/10 backdrop-blur-md transition-all shadow-glass"
        >
          <Menu size={24} />
        </motion.button>

        {/* Sidebar Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeMenu}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              />

              {/* Sidebar */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-0 left-0 h-full w-72 bg-[#0f172a]/95 border-r border-white/10 z-[70] p-6 shadow-2xl overflow-y-auto"
              >
                <div className="flex flex-col h-full">
                  {/* Sidebar Header */}
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-2">
                      <Activity size={28} className="text-cyan-400" />
                      <h2 className="text-xl font-bold text-white tracking-wide">IoT Panel</h2>
                    </div>
                    <button onClick={closeMenu} className="p-1 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                      <X size={24} />
                    </button>
                  </div>

                  {/* Navigation Links */}
                  <nav className="flex-1 space-y-2">
                      {[
                        { icon: Home, label: 'Trang Chủ', active: currentView === 'dashboard', view: 'dashboard' },
                        { icon: Database, label: 'Dữ liệu cảm biến', active: currentView === 'history', view: 'history' },
                        { icon: ClipboardList, label: 'Lịch sử hoạt động', active: currentView === 'device_history', view: 'device_history' },
                        { icon: User, label: 'Profile', active: currentView === 'profile', view: 'profile' },
                        { icon: SettingsIcon, label: 'Cài đặt', active: currentView === 'settings', view: 'settings' },
                      ].map((item, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ x: 5 }}
                        onClick={() => item.view && handleNavigation(item.view)}
                        className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${item.active
                          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30'
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
                          }`}
                      >
                        <item.icon size={20} />
                        <span className="font-medium text-sm">{item.label}</span>
                      </motion.button>
                    ))}
                  </nav>

                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Header - Ultra Compact */}
        <motion.header
          className="mb-2 text-center flex-shrink-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-0.5">
            <Activity size={24} className="text-cyan-400" />
            <h1 className="text-xl lg:text-2xl font-bold gradient-text from-cyan-400 to-blue-500">
              Bảng Điều Khiển IoT
            </h1>
          </div>
          <p className="text-white/60 text-[10px] lg:text-xs">
            Giám sát & Điều khiển Môi trường Thời gian thực
          </p>
        </motion.header>

        {/* Content Area */}
        <div className="flex-1 min-h-0 relative">
          <AnimatePresence mode="wait">
            {currentView === 'dashboard' ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="h-full flex flex-col"
              >
                {/* Main Content Grid - 2 Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 flex-1 min-h-0">
                  {/* Left Column: Sensor Bars */}
                  <div className="grid grid-cols-1 gap-2 overflow-y-auto lg:overflow-visible pr-1 lg:pr-0">
                    <Temperature3DBar temperature={sensorData.temperature} />
                    <Humidity3DBar humidity={sensorData.humidity} />
                    <Light3DBar light={sensorData.light} />
                  </div>

                  {/* Right Column: Device Controls + Chart */}
                  <div className="flex flex-col gap-2 min-h-0">
                    {/* Device Controls */}
                    <div className="grid grid-cols-3 gap-2 flex-shrink-0">
                      <DeviceCard
                        name="Quạt"
                        icon={Fan}
                        isOn={devices.fan}
                        isLoading={loadingStates.fan}
                        onToggle={() => toggleDevice('fan')}
                        gradient="from-blue-400 to-cyan-500"
                        iconColor="text-cyan-400"
                      />
                      <DeviceCard
                        name="Điều Hòa"
                        icon={Wind}
                        isOn={devices.airConditioner}
                        isLoading={loadingStates.airConditioner}
                        onToggle={() => toggleDevice('airConditioner')}
                        gradient="from-blue-500 to-indigo-500"
                        iconColor="text-blue-400"
                      />
                      <DeviceCard
                        name="Đèn"
                        icon={Lightbulb}
                        isOn={devices.light}
                        isLoading={loadingStates.light}
                        onToggle={() => toggleDevice('light')}
                        gradient="from-yellow-400 to-amber-500"
                        iconColor="text-yellow-400"
                      />
                    </div>

                    {/* Chart - Fills remaining space */}
                    <div className="flex-1 min-h-0">
                      <SensorChart data={history} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : currentView === 'history' ? (
              <motion.div
                key="history"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <SensorHistory />
              </motion.div>
            ) : currentView === 'profile' ? (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <Profile />
              </motion.div>
            ) : currentView === 'settings' ? (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <Settings />
              </motion.div>
            ) : (
              <motion.div
                key="device_history"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <DeviceHistory />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer - Ultra Compact */}
        <motion.footer
          className="text-center text-white/30 text-[10px] mt-1 flex-shrink-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p>Cập nhật: {sensorData.timestamp.toLocaleString('vi-VN')}</p>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;
