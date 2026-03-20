import { Droplets } from 'lucide-react';
import { motion } from 'framer-motion';
import { SensorCard } from './SensorCard';
import { FogOverlay } from './effects/FogOverlay';
import { getHumidityEffect } from '../utils/sensorEffects';

/**
 * Humidity sensor card with fog effects
 */
export const HumidityCard = ({ humidity }) => {
    const effect = getHumidityEffect(humidity);

    return (
        <SensorCard
            title="Humidity"
            value={humidity}
            unit="%"
            icon={({ size }) => (
                <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <Droplets size={size} />
                </motion.div>
            )}
            status={effect.status}
            gradient={effect.gradient}
            glow=""
            backgroundImage={effect.backgroundImage}
        >
            {effect.fog && (
                <FogOverlay opacity={effect.fogLevel} blur={effect.blur} />
            )}
        </SensorCard>
    );
};
