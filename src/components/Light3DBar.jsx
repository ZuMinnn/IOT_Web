import { Sun } from 'lucide-react';
import { Sensor3DBar } from './Sensor3DBar';
import { getLightEffect } from '../utils/sensorEffects';
import { useSettings } from '../hooks/useSettings';

/**
 * 3D Light Bar
 */
export const Light3DBar = ({ light }) => {
    const { settings } = useSettings();
    const is3Pin = settings.ldrType === '3pin';
    
    // For 4-pin LDR, we use the literal value. For 3-pin, > 0 or specific thresholds might mean bright/dark.
    // Assuming light >= 1 means 'Sáng' if 3-pin is sending 0 or 1
    const isBright = light >= 1; 
    
    // Determine display value, units, etc based on settings
    const displayValue = is3Pin ? (isBright ? 'Sáng' : 'Tối') : light;
    const numericValue = is3Pin ? (isBright ? 1000 : 0) : light; // force full/empty bar for 3pin
    const displayUnit = is3Pin ? null : 'lux';
    
    // Use maximum/minimum effect for 3-pin to clearly show Sáng/Tối
    const effect = is3Pin 
        ? getLightEffect(isBright ? 1000 : 0) 
        : getLightEffect(light);

    // Override status text for 3-pin since getLightEffect might return other strings
    const statusText = is3Pin ? (isBright ? 'Sáng' : 'Tối') : effect.status;

    return (
        <Sensor3DBar
            title="Ánh Sáng"
            value={numericValue}
            displayValue={displayValue}
            unit={displayUnit}
            min={0}
            max={1000}
            icon={Sun}
            status={statusText}
            gradient={effect.gradient}
            barGradient={effect.barGradient}
            glow={effect.glow}
        />
    );
};
