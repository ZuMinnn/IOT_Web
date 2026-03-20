import { Thermometer } from 'lucide-react';
import { Sensor3DBar } from './Sensor3DBar';
import { getTemperatureEffect } from '../utils/sensorEffects';

/**
 * 3D Temperature Bar  
 */
export const Temperature3DBar = ({ temperature }) => {
    const effect = getTemperatureEffect(temperature);

    return (
        <Sensor3DBar
            title="Nhiệt Độ"
            value={temperature}
            unit="°C"
            min={0}
            max={50}
            icon={Thermometer}
            status={effect.status}
            gradient={effect.gradient}
            barGradient={effect.barGradient}
            glow={effect.glow}
        />
    );
};
