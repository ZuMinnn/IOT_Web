import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { SensorCard } from './SensorCard';
import { RadialGlow } from './effects/RadialGlow';
import { getLightEffect } from '../utils/sensorEffects';

/**
 * Light sensor card with radial glow effect
 */
export const LightCard = ({ light }) => {
    const effect = getLightEffect(light);
    const isBright = light > 800;

    return (
        <SensorCard
            title="Light Intensity"
            value={light}
            unit="lux"
            icon={({ size }) => {
                const IconComponent = isBright ? Sun : Moon;
                return (
                    <motion.div
                        animate={
                            effect.iconRotate
                                ? { rotate: [0, 360] }
                                : { rotate: 0 }
                        }
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    >
                        <IconComponent size={size} />
                    </motion.div>
                );
            }}
            status={effect.status}
            gradient={effect.gradient}
            glow=""
            backgroundImage={effect.backgroundImage}
        >
            {effect.glow && (
                <RadialGlow color={effect.color} radius={effect.glowRadius} />
            )}
        </SensorCard>
    );
};
