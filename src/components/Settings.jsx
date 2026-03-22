import { useSettings } from '../hooks/useSettings';
import { Settings as SettingsIcon, Cpu, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export const Settings = () => {
  const { settings, updateSettings } = useSettings();

  const handleLdrTypeChange = (type) => {
    updateSettings({ ldrType: type });
  };

  return (
    <div className="h-full bg-[#0f172a] rounded-3xl p-6 lg:p-8 flex flex-col gap-6 text-white overflow-y-auto">
      <div className="flex items-center gap-3">
        <SettingsIcon size={32} className="text-cyan-400" />
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          Cài đặt hệ thống
        </h2>
      </div>

      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <Cpu className="text-blue-400" size={24} />
          <h3 className="text-lg font-semibold">Cấu hình Phần cứng</h3>
        </div>
        
        <div className="space-y-4">
          <p className="text-white/60 text-sm">
            Chọn loại cảm biến Quang trở (LDR) bạn đang sử dụng. Điều này sẽ thay đổi cách bảng điều khiển hiển thị dữ liệu ánh sáng.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {/* 3-pin LDR Option */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleLdrTypeChange('3pin')}
              className={`relative p-5 rounded-xl border-2 text-left transition-all ${
                settings.ldrType === '3pin'
                  ? 'bg-cyan-500/10 border-cyan-500'
                  : 'bg-white/5 border-transparent hover:border-white/20'
              }`}
            >
              {settings.ldrType === '3pin' && (
                <div className="absolute top-4 right-4 text-cyan-400">
                  <Check size={20} />
                </div>
              )}
              <h4 className={`text-lg font-bold ${settings.ldrType === '3pin' ? 'text-cyan-400' : 'text-white'}`}>
                Quang trở 3 chân
              </h4>
              <p className="text-white/50 text-xs mt-2">
                Chỉ hiển thị trạng thái Trạng thái Sáng / Tối cơ bản.
              </p>
            </motion.button>

            {/* 4-pin LDR Option */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleLdrTypeChange('4pin')}
              className={`relative p-5 rounded-xl border-2 text-left transition-all ${
                settings.ldrType === '4pin'
                  ? 'bg-cyan-500/10 border-cyan-500'
                  : 'bg-white/5 border-transparent hover:border-white/20'
              }`}
            >
              {settings.ldrType === '4pin' && (
                <div className="absolute top-4 right-4 text-cyan-400">
                  <Check size={20} />
                </div>
              )}
              <h4 className={`text-lg font-bold ${settings.ldrType === '4pin' ? 'text-cyan-400' : 'text-white'}`}>
                Quang trở 4 chân
              </h4>
              <p className="text-white/50 text-xs mt-2">
                Hiển thị cụ thể chi tiết độ sáng với đơn vị (Lux).
              </p>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};
