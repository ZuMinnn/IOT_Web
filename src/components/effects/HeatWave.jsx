import { motion } from 'framer-motion';

/**
 * Heat Wave Effect - distortion waves rising from hot temperature
 */
export const HeatWave = () => {
    return (
        <div className="absolute inset-0 overflow-hidden">
            {/* Heat distortion waves */}
            {[...Array(4)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute bottom-0 left-0 right-0 h-16"
                    style={{
                        background: `linear-gradient(180deg, 
                            rgba(255, 100, 0, ${0.1 - i * 0.02}), 
                            transparent)`,
                        filter: `blur(${8 + i * 2}px)`,
                    }}
                    animate={{
                        y: [0, -200],
                        opacity: [0.6, 0],
                    }}
                    transition={{
                        duration: 2 + i * 0.3,
                        delay: i * 0.2,
                        repeat: Infinity,
                        ease: 'easeOut',
                    }}
                />
            ))}

            {/* Shimmering heat particles */}
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={`particle-${i}`}
                    className="absolute w-1 h-1 bg-orange-400/60 rounded-full"
                    style={{
                        left: `${10 + i * 10}%`,
                        bottom: '5%',
                        filter: 'blur(1px)',
                    }}
                    animate={{
                        y: [-10, -150],
                        x: [0, (i % 3 - 1) * 15],
                        opacity: [1, 0],
                        scale: [1, 0.5],
                    }}
                    transition={{
                        duration: 2,
                        delay: i * 0.15,
                        repeat: Infinity,
                        ease: 'easeOut',
                    }}
                />
            ))}

            {/* Heat glow at bottom */}
            <div
                className="absolute bottom-0 left-0 right-0 h-1/3"
                style={{
                    background: 'linear-gradient(180deg, transparent, rgba(255, 100, 0, 0.15))',
                    filter: 'blur(10px)',
                }}
            />
        </div>
    );
};
