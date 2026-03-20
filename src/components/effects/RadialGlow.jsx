import { motion } from 'framer-motion';

/**
 * Radial glow effect for light sensor
 * @param {string} color - Glow color
 * @param {number} radius - Glow radius percentage
 */
export const RadialGlow = ({ color = '#FACC15', radius = 50 }) => {
    return (
        <motion.div
            className="radial-glow"
            style={{
                color,
                width: `${radius}%`,
                height: `${radius}%`,
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
                scale: [0.8, 1, 0.8],
                opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
        />
    );
};
