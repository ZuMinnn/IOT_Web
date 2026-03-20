import { Sun } from 'lucide-react';
import { Sensor3DBar } from './Sensor3DBar';
import { getLightEffect } from '../utils/sensorEffects';

/**
 * 3D Light Bar
 */
export const Light3DBar = ({ light }) => {
    const effect = getLightEffect(light);

    return (
        <Sensor3DBar
            title="Ánh Sáng"
            value={light}
            unit="lux"
            min={0}
            max={1000}
            icon={Sun}
            status={effect.status}
            gradient={effect.gradient}
            barGradient={effect.barGradient}
            glow={effect.glow}
        />
    );
};
