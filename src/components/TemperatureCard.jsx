import { Thermometer } from 'lucide-react';
import { SensorCard } from './SensorCard';
import { HeatWave } from './effects/HeatWave';
import { getTemperatureEffect } from '../utils/sensorEffects';

/**
 * Temperature sensor card with dynamic heat effects
 */
export const TemperatureCard = ({ temperature }) => {
    const effect = getTemperatureEffect(temperature);

    return (
        <SensorCard
            title="Temperature"
            value={temperature}
            unit="°C"
            icon={Thermometer}
            status={effect.status}
            gradient={effect.gradient}
            glow={effect.glow}
            backgroundImage={effect.backgroundImage}
        >
            {effect.heatWave && <HeatWave />}
        </SensorCard>
    );
};
