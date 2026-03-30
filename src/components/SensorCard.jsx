import { motion } from 'framer-motion';
import { useState } from 'react';

/**
 * Base sensor card with 3D tilt effect and dynamic backgrounds
 */
export const SensorCard = ({
    title,
    value,
    unit,
    icon: Icon,
    status,
    gradient,
    glow,
    backgroundImage,
    children
}) => {
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);

    const handleMouseMove = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateXValue = ((y - centerY) / centerY) * -10;
        const rotateYValue = ((x - centerX) / centerX) * 10;

        setRotateX(rotateXValue);
        setRotateY(rotateYValue);
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
    };

    return (
        <motion.div
            className={`glass-card glass-hover depth-layer relative overflow-hidden p-6 tilt-3d ${glow || ''}`}
            style={{
                transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Background Image Layer */}
            {backgroundImage && (
                <div className="card-bg-layer">
                    <div
                        className="card-bg-image"
                        style={{
                            backgroundImage: `url(${backgroundImage})`,
                        }}
                    />
                    <div className="dark-overlay" />
                </div>
            )}

            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-30 z-[2]`} />

            {/* Content */}
            <div className="card-content-layer">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white/90">{title}</h3>
                    <div className="text-white/70">
                        <Icon size={24} />
                    </div>
                </div>

                {/* Value with 3D Text Effect */}
                <motion.div
                    className="flex items-baseline gap-2 mb-2"
                    key={value}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <span className="text-6xl font-bold text-white text-3d-light">
                        {!isNaN(parseFloat(value)) ? parseFloat(value).toFixed(2) : value}
                    </span>
                    <span className="text-2xl text-white/80 font-semibold">{unit}</span>
                </motion.div>

                {/* Status */}
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${status === 'Normal' ? 'bg-green-400' : 'bg-yellow-400'
                        } animate-pulse`} />
                    <span className="text-sm text-white/80 font-medium">{status}</span>
                </div>
            </div>

            {/* Custom effects */}
            {children}
        </motion.div>
    );
};
