import { Droplets } from 'lucide-react';
import { Sensor3DBar } from './Sensor3DBar';
import { WaterDroplet } from './effects/WaterDroplet';
import { getHumidityEffect } from '../utils/sensorEffects';

/**
 * 3D Humidity Bar with water droplet animations
 */
export const Humidity3DBar = ({ humidity }) => {
    const effect = getHumidityEffect(humidity);

    return (
        <Sensor3DBar
            title="Độ Ẩm"
            value={humidity}
            unit="%"
            min={0}
            max={100}
            icon={Droplets}
            status={effect.status}
            gradient={effect.gradient}
            barGradient={effect.barGradient}
            glow={effect.glow}
        >
            {effect.waterEffect && <WaterDroplet intensity={effect.waterIntensity} />}
        </Sensor3DBar>
    );
};
