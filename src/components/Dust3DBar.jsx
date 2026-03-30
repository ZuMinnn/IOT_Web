import { Wind } from 'lucide-react';
import { Sensor3DBar } from './Sensor3DBar';

export const Dust3DBar = ({ dust }) => {
    const isWarning = dust > 60;
    
    const effect = {
        gradient: isWarning ? 'from-rose-500/20 to-red-500/20' : 'from-slate-400/20 to-gray-500/20',
        barGradient: isWarning ? 'from-red-400 to-rose-600' : 'from-gray-400 to-slate-600',
        glow: isWarning ? 'shadow-red-500/50' : 'shadow-gray-400/30',
        status: isWarning ? 'Cảnh Báo' : 'Bình Thường'
    };

    return (
        <Sensor3DBar
            title="Độ Bụi"
            value={dust}
            displayValue={dust}
            unit="%"
            min={0}
            max={100}
            icon={Wind}
            status={effect.status}
            gradient={effect.gradient}
            barGradient={effect.barGradient}
            glow={effect.glow}
        />
    );
};
