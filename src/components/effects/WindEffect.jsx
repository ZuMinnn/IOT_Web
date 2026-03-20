import { motion } from 'framer-motion';
import { useMemo } from 'react';

/**
 * Wind Particle Component
 */
const WindParticle = ({ delay, top, duration }) => {
    return (
        <motion.div
            className="absolute"
            style={{
                left: '-10%',
                top: `${top}%`,
            }}
            initial={{ x: 0, opacity: 0 }}
            animate={{
                x: ['0%', '120%'],
                opacity: [0, 0.6, 0.4, 0],
            }}
            transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: 'linear',
            }}
        >
            <div className="flex gap-1">
                <div className="w-3 h-0.5 bg-blue-300/50 rounded-full" />
                <div className="w-2 h-0.5 bg-blue-400/40 rounded-full" />
                <div className="w-2.5 h-0.5 bg-cyan-300/30 rounded-full" />
            </div>
        </motion.div>
    );
};

/**
 * Wind Effect - flowing particles for AC
 */
export const WindEffect = () => {
    // Use deterministic values to avoid hydration mismatch
    const particles = useMemo(() => Array.from({ length: 8 }, (_, i) => ({
        id: i,
        delay: i * 0.4,
        top: ((i * 37) % 70) + 15, // Deterministic "random" positioning
        duration: 2 + ((i * 17) % 10) / 10, // Different speeds
    })), []);

    return (
        <div className="absolute inset-0 overflow-hidden">
            {/* Flowing gradient */}
            <motion.div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1) 50%, transparent)',
                }}
                animate={{
                    x: ['-100%', '100%'],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            />

            {/* Wind particles */}
            {particles.map((particle) => (
                <WindParticle
                    key={particle.id}
                    delay={particle.delay}
                    top={particle.top}
                    duration={particle.duration}
                />
            ))}
        </div>
    );
};
