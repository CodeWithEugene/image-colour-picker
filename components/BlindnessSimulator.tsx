
import React from 'react';
import { RGB } from '../types';
import { simulateBlindness, rgbToHex } from '../utils/colorConverter';
import { ColorInfoPanel } from './ColorInfoPanel';

interface BlindnessSimulatorProps {
    color: RGB;
}

export const BlindnessSimulator: React.FC<BlindnessSimulatorProps> = ({ color }) => {
    const protanopia = simulateBlindness(color, 'protanopia');
    const deuteranopia = simulateBlindness(color, 'deuteranopia');
    const tritanopia = simulateBlindness(color, 'tritanopia');

    return (
        <ColorInfoPanel.Panel title="Color Blindness Simulation">
            <div className="grid grid-cols-2 gap-3 text-sm">
                <Swatch label="Normal" color={rgbToHex(color)} />
                <Swatch label="Protanopia" color={rgbToHex(protanopia)} />
                <Swatch label="Deuteranopia" color={rgbToHex(deuteranopia)} />
                <Swatch label="Tritanopia" color={rgbToHex(tritanopia)} />
            </div>
        </ColorInfoPanel.Panel>
    );
};

const Swatch: React.FC<{label: string, color: string}> = ({label, color}) => (
    <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded border border-white/20" style={{ backgroundColor: color }}></div>
        <div>
            <div className="text-gray-300">{label}</div>
            <div className="text-xs text-gray-500 font-mono">{color}</div>
        </div>
    </div>
);
