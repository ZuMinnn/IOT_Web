import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Water Droplet Animation
 * Creates falling water droplets with ripple effects
 */
const Droplet = ({ delay, left }) => {
    return (
        <motion.div
            className="absolute w-2 h-3 bg-gradient-to-b from-cyan-200/80 to-blue-400/60 rounded-full"
            style={{
                left: `${left}%`,
                filter: 'drop-shadow(0 0 3px rgba(34, 211, 238, 0.4))',
            }}
            initial={{ top: '-10px', opacity: 0 }}
            animate={{
                top: ['0%', '100%'],
                opacity: [0, 1, 1, 0],
            }}
            transition={{
                duration: 2,
                delay,
                repeat: Infinity,
                ease: 'linear',
            }}
        />
    );
};

/**
 * Ripple effect when droplet hits bottom
 */
const Ripple = ({ delay, left }) => {
    return (
        <motion.div
            className="absolute bottom-0 w-8 h-8 border-2 border-cyan-400/40 rounded-full"
            style={{
                left: `calc(${left}% - 16px)`,
            }}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{
                scale: [0, 2],
                opacity: [0.6, 0],
            }}
            transition={{
                duration: 1,
                delay: delay + 2,
                repeat: Infinity,
                ease: 'easeOut',
            }}
        />
    );
};

/**
 * Bubble rising effect
 */
const Bubble = ({ delay, left }) => {
    return (
        <motion.div
            className="absolute w-3 h-3 bg-white/20 rounded-full border border-white/30"
            style={{
                left: `${left}%`,
                filter: 'blur(0.5px)',
            }}
            initial={{ bottom: '0%', opacity: 0 }}
            animate={{
                bottom: ['0%', '100%'],
                opacity: [0, 0.6, 0],
                scale: [0.8, 1.2, 1],
            }}
            transition={{
                duration: 3,
                delay,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
        />
    );
};

/**
 * Water Wave Effect
 */
const WaterWave = () => {
    return (
        <div className="absolute inset-0 overflow-hidden">
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-1/3"
                style={{
                    background: 'linear-gradient(180deg, transparent, rgba(34, 211, 238, 0.1))',
                }}
                animate={{
                    y: [0, -5, 0],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
        </div>
    );
};

/**
 * Main Water Effects Component
 */
export const WaterDroplet = ({ intensity = 1 }) => {
    const [droplets, setDroplets] = useState([]);

    useEffect(() => {
        // Generate random droplets based on intensity
        const count = Math.floor(intensity * 6);
        const newDroplets = Array.from({ length: count }, (_, i) => ({
            id: i,
            delay: Math.random() * 2,
            left: Math.random() * 90 + 5,
        }));
        setDroplets(newDroplets);
    }, [intensity]);

    return (
        <>
            {/* Water wave background */}
            <WaterWave />

            {/* Falling droplets */}
            {droplets.map((drop) => (
                <Droplet key={`drop-${drop.id}`} delay={drop.delay} left={drop.left} />
            ))}

            {/* Ripples */}
            {droplets.slice(0, 3).map((drop) => (
                <Ripple key={`ripple-${drop.id}`} delay={drop.delay} left={drop.left} />
            ))}

            {/* Rising bubbles */}
            {droplets.slice(0, 4).map((drop) => (
                <Bubble
                    key={`bubble-${drop.id}`}
                    delay={drop.delay + 0.5}
                    left={drop.left + 10}
                />
            ))}
        </>
    );
};
