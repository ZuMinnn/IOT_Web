import { motion } from 'framer-motion';

/**
 * Minimal 3D Sensor Bar for debugging
 */
export const Sensor3DBarMinimal = ({
    title,
    value,
    unit,
}) => {
    return (
        <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white/90 mb-4">{title}</h3>
            <div className="text-6xl font-bold text-white">{value}</div>
            <span className="text-3xl text-white/80">{unit}</span>
        </div>
    );
};
