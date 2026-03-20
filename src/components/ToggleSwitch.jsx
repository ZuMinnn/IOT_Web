import { motion } from 'framer-motion';

/**
 * Animated toggle switch for device controls
 */
export const ToggleSwitch = ({ isOn, onToggle, disabled = false }) => {
    return (
        <button
            onClick={onToggle}
            disabled={disabled}
            className={`relative w-16 h-8 rounded-full transition-all duration-300 ${isOn ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-white/20'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'}`}
        >
            {/* Toggle knob */}
            <motion.div
                className={`absolute top-1 w-6 h-6 rounded-full ${isOn ? 'bg-white' : 'bg-white/80'
                    }`}
                animate={{
                    x: isOn ? 34 : 4,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                }}
            >
                {/* Inner glow when on */}
                {isOn && (
                    <motion.div
                        className="absolute inset-0 rounded-full bg-green-400"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 0.3, scale: 1 }}
                        transition={{ duration: 0.2 }}
                    />
                )}
            </motion.div>

            {/* Ripple effect on toggle */}
            {isOn && (
                <motion.div
                    className="absolute inset-0 rounded-full border-2 border-green-400"
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 1.2, opacity: 0 }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'easeOut',
                    }}
                />
            )}
        </button>
    );
};
