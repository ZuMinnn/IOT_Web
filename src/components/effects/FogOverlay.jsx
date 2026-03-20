import { motion } from 'framer-motion';

/**
 * Fog overlay effect for humidity visualization
 * @param {number} opacity - Fog opacity level (0-1)
 * @param {number} blur - Blur amount
 */
export const FogOverlay = ({ opacity = 0.3, blur = 8 }) => {
    return (
        <motion.div
            className="fog-overlay"
            style={{
                opacity,
                filter: `blur(${blur}px)`,
            }}
            initial={{ opacity: 0 }}
            animate={{
                opacity,
                x: [0, 10, 0],
                y: [0, -10, 0],
            }}
            transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
        />
    );
};
