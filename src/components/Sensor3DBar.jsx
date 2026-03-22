import { motion } from 'framer-motion';

/**
 * Base 3D Sensor Bar Component  
 */
export const Sensor3DBar = ({
    title,
    value,
    displayValue,
    unit,
    min = 0,
    max = 100,
    icon: Icon,
    status,
    gradient,
    barGradient,
    glow,
    children
}) => {
    // Calculate fill percentage based on numeric value, fallback to 0 if value is string
    const numericValue = typeof value === 'number' ? value : 0;
    const percentage = Math.min(Math.max(((numericValue - min) / (max - min)) * 100, 0), 100);

    return (
        <motion.div
            className={`glass-card glass-hover depth-layer relative overflow-hidden p-4 ${glow || ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Background gradient */}
            {gradient && <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20 z-[1]`} />}

            {/* Content */}
            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-white/90">{title}</h3>
                    {Icon && (
                        <div className="text-white/80">
                            <Icon size={18} />
                        </div>
                    )}
                </div>

                {/* 3D Bar Container */}
                <div className="relative mb-2">
                    <div className="relative w-full h-24 rounded-xl bg-black/30 backdrop-blur-sm border border-white/10 overflow-hidden">
                        {/* Filled Bar */}
                        <motion.div
                            className={`absolute bottom-0 left-0 right-0 rounded-xl ${barGradient ? `bg-gradient-to-t ${barGradient}` : 'bg-blue-500'}`}
                            initial={{ height: '0%' }}
                            animate={{ height: `${percentage}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                        >
                            {/* 3D Cylinder/Glass Effect Layers */}
                            {/* 1. Base Gradient (Already applied via barGradient) */}

                            {/* 2. Side Highlight (Right) */}
                            <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />

                            {/* 3. Side Highlight (Left) */}
                            <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white/20 to-transparent pointer-events-none" />

                            {/* 4. Glass Shine (Diagonal) */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-50 pointer-events-none" />

                            {/* 5. Top Specular Reflection (Liquid surface effect) */}
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/50 shadow-[0_0_10px_rgba(255,255,255,0.7)] pointer-events-none" />
                        </motion.div>

                        {/* Custom effects from children */}
                        {children && (
                            <div className="absolute inset-0 overflow-hidden">
                                {children}
                            </div>
                        )}
                    </div>
                </div>

                {/* Value Display */}
                <div className="flex items-baseline justify-center gap-1 mb-1">
                    <span className="text-2xl font-bold text-white text-3d-light">
                        {displayValue !== undefined ? displayValue : value}
                    </span>
                    {unit && <span className="text-lg text-white/80 font-semibold">{unit}</span>}
                </div>

                {/* Status */}
                {status && (
                    <div className="flex items-center justify-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${status === 'Bình thường' ? 'bg-green-400' :
                            status === 'Khô' || status === 'Tối' || status === 'Lạnh' ? 'bg-blue-400' :
                                'bg-yellow-400'
                            } animate-pulse`} />
                        <span className="text-[10px] text-white/80 font-medium uppercase tracking-wide">{status}</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};
