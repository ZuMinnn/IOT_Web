import { motion } from 'framer-motion';
import { useMemo } from 'react';

/**
 * Ice Crystal Component
 */
const IceCrystal = ({ delay, left, top }) => {
    return (
        <motion.div
            className="absolute"
            style={{
                left: `${left}%`,
                top: `${top}%`,
            }}
            initial={{ scale: 0, rotate: 0, opacity: 0 }}
            animate={{
                scale: [0, 1, 1],
                rotate: [0, 360],
                opacity: [0, 0.6, 0.6],
            }}
            transition={{
                duration: 3,
                delay,
                repeat: Infinity,
                repeatDelay: 2,
            }}
        >
            <div className="relative">
                {/* Crystal shape using CSS */}
                <div className="w-3 h-3 bg-cyan-300/40 rotate-45 backdrop-blur-sm border border-cyan-200/60" />
                <div className="absolute inset-0 w-3 h-3 bg-cyan-300/40 rotate-90 backdrop-blur-sm border border-cyan-200/60" />
            </div>
        </motion.div>
    );
};

/**
 * Frost Effect - spreading from bottom
 */
export const FrostEffect = () => {
    // Use deterministic values to avoid hydration mismatch
    const crystals = useMemo(() => Array.from({ length: 12 }, (_, i) => ({
        id: i,
        delay: i * 0.2,
        left: ((i * 73) % 90) + 5, // Deterministic "random" positioning
        top: ((i * 47) % 80) + 10,
    })), []);

    return (
        <div className="absolute inset-0 overflow-hidden">
            {/* Frosted glass effect */}
            <motion.div
                className="absolute bottom-0 left-0 right-0"
                style={{
                    height: '60%',
                    background: 'linear-gradient(180deg, transparent, rgba(164, 219, 232, 0.15))',
                    backdropFilter: 'blur(2px)',
                }}
                initial={{ height: '0%' }}
                animate={{ height: '60%' }}
                transition={{ duration: 2, ease: 'easeOut' }}
            />

            {/* Ice crystals */}
            {crystals.map((crystal) => (
                <IceCrystal
                    key={crystal.id}
                    delay={crystal.delay}
                    left={crystal.left}
                    top={crystal.top}
                />
            ))}

            {/* Icy shimmer */}
            <motion.div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(45deg, transparent 30%, rgba(164, 219, 232, 0.1) 50%, transparent 70%)',
                }}
                animate={{
                    x: ['-100%', '100%'],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            />
        </div>
    );
};
