import { motion } from 'framer-motion';
import { ToggleSwitch } from './ToggleSwitch';
import { Loader2 } from 'lucide-react';
import { WindEffect } from './effects/WindEffect';

/**
 * Device control card with toggle switch
 */
export const DeviceCard = ({
    name,
    icon: Icon,
    isOn,
    isLoading = false,
    onToggle,
    gradient,
    iconColor,
    isBlinking = false,
}) => {
    return (
        <motion.div
            className={`glass-card relative overflow-hidden p-3 ${isOn ? 'border-white/30' : 'border-white/10'
                } border transition-all duration-300 ${isBlinking ? 'animate-pulse' : ''}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
        >
            {/* Background gradient - stronger when on */}
            <div
                className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-opacity duration-300 ${isOn ? 'opacity-30' : 'opacity-10'
                    }`}
            />

            {/* Glow effect when on */}
            {isOn && !isLoading && (
                <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.1, 0.2, 0.1] }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            )}

            {/* Device-specific visual effects */}
            {isOn && !isLoading && name === 'Điều Hòa' && (
                <WindEffect />
            )}

            {/* Radial glow for Light */}
            {isOn && !isLoading && name === 'Đèn' && (
                <motion.div
                    className="absolute inset-0"
                    style={{
                        background: 'radial-gradient(circle at center, rgba(250, 204, 21, 0.3), transparent 70%)',
                    }}
                    animate={{
                        opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            )}

            {/* Content */}
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                    {/* Icon with device-specific animations */}
                    <motion.div
                        className={`${iconColor} ${isOn && !isLoading ? 'opacity-100' : 'opacity-60'}`}
                        animate={
                            isOn && !isLoading
                                ? name === 'Quạt'
                                    ? {
                                        rotate: 360,
                                    }
                                    : name === 'Điều Hòa'
                                        ? {
                                            x: [0, -2, 2, -2, 2, 0],
                                            y: [0, -1, 1, -1, 0],
                                        }
                                        : name === 'Đèn'
                                            ? {
                                                scale: [1, 1.15, 1],
                                                filter: [
                                                    'drop-shadow(0 0 2px rgba(250, 204, 21, 0.5))',
                                                    'drop-shadow(0 0 8px rgba(250, 204, 21, 0.8))',
                                                    'drop-shadow(0 0 2px rgba(250, 204, 21, 0.5))',
                                                ],
                                            }
                                            : name === 'Cảnh Báo' 
                                                ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, -10, 10, 0] }
                                                : {
                                                scale: [1, 1.1, 1],
                                                rotate: [0, 5, -5, 0],
                                            }
                                : {}
                        }
                        transition={
                            isOn && !isLoading
                                ? name === 'Quạt'
                                    ? {
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: 'linear',
                                    }
                                    : name === 'Điều Hòa'
                                        ? {
                                            duration: 1.5,
                                            repeat: Infinity,
                                            ease: 'easeInOut',
                                        }
                                        : name === 'Đèn'
                                            ? {
                                                duration: 1.2,
                                                repeat: Infinity,
                                                ease: 'easeInOut',
                                            }
                                            : {
                                                duration: 0.5,
                                                repeat: Infinity,
                                                repeatDelay: 2,
                                            }
                                : {}
                        }
                    >
                        <Icon size={24} strokeWidth={2} />
                    </motion.div>

                    {/* Toggle Switch */}
                    <ToggleSwitch isOn={isOn} onToggle={onToggle} disabled={isLoading} />
                </div>

                {/* Device name and status */}
                <div>
                    <h3 className={`text-base font-bold mb-1 ${isOn ? 'text-white' : 'text-white/70'}`}>
                        {name}
                    </h3>
                    <div className="flex items-center gap-2">
                        {isLoading ? (
                            <>
                                <Loader2 className="w-3 h-3 text-yellow-400 animate-spin" />
                                <span className="text-xs font-medium text-yellow-400">
                                    Đang chờ...
                                </span>
                            </>
                        ) : (
                            <>
                                <motion.div
                                    className={`w-2 h-2 rounded-full ${isOn ? 'bg-green-400' : 'bg-white/30'
                                        }`}
                                    animate={
                                        isOn
                                            ? {
                                                opacity: [0.5, 1, 0.5],
                                              }
                                            : isBlinking 
                                              ? { opacity: [0.1, 1, 0.1] }
                                              : {}
                                    }
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    }}
                                />
                                <span className={`text-xs font-medium ${isOn ? 'text-green-400' : 'text-white/50'}`}>
                                    {isBlinking ? 'CẢNH BÁO' : (isOn ? 'Đang bật' : 'Đã tắt')}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
