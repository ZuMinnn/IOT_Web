import { motion } from 'framer-motion';

/**
 * Light Ray Component
 */
const Ray = ({ angle, delay }) => {
    return (
        <motion.div
            className="absolute top-1/2 left-1/2 origin-left"
            style={{
                width: '200%',
                height: '2px',
                background: 'linear-gradient(90deg, rgba(250, 204, 21, 0.6) 0%, transparent 70%)',
                transform: `rotate(${angle}deg) translateX(-50%)`,
                filter: 'blur(1px)',
            }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{
                opacity: [0, 0.8, 0],
                scaleX: [0, 1, 0],
            }}
            transition={{
                duration: 2,
                delay,
                repeat: Infinity,
                ease: 'easeOut',
            }}
        />
    );
};

/**
 * Light Rays Effect - radiating from center
 */
export const LightRays = ({ rayCount = 8 }) => {
    const rays = Array.from({ length: rayCount }, (_, i) => ({
        angle: (360 / rayCount) * i,
        delay: (i * 0.2) % 2,
    }));

    return (
        <div className="absolute inset-0 overflow-hidden">
            {/* Central glow */}
            <motion.div
                className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full"
                style={{
                    transform: 'translate(-50%, -50%)',
                    background: 'radial-gradient(circle, rgba(250, 204, 21, 0.4) 0%, transparent 70%)',
                    filter: 'blur(20px)',
                }}
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            {/* Rays */}
            {rays.map((ray, i) => (
                <Ray key={i} angle={ray.angle} delay={ray.delay} />
            ))}

            {/* Sparkles */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                    style={{
                        top: `${20 + Math.random() * 60}%`,
                        left: `${20 + Math.random() * 60}%`,
                    }}
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                    }}
                    transition={{
                        duration: 1.5,
                        delay: i * 0.3,
                        repeat: Infinity,
                    }}
                />
            ))}
        </div>
    );
};
