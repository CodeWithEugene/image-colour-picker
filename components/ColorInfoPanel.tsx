
import React from 'react';
import { ColorData, RGB } from '../types';
import { useColorData } from '../hooks/useColorData';
import { ColorCodes } from './ColorCodes';
import { ColorPalettes } from './ColorPalettes';
import { ContrastChecker } from './ContrastChecker';
import { BlindnessSimulator } from './BlindnessSimulator';
import { HistoryPanel } from './HistoryPanel';

interface ColorInfoPanelProps {
    colorData: ColorData | null;
    history: RGB[];
    onHistorySelect: (rgb: RGB) => void;
    activeRgb: RGB | null;
}

export const ColorInfoPanel: React.FC<ColorInfoPanelProps> = ({ colorData, history, onHistorySelect, activeRgb }) => {
    const { palettes } = useColorData(colorData?.rgb || null);

    if (!colorData) {
        return (
            <div className="sticky top-8 flex flex-col items-center justify-center h-96 bg-white/5 border border-white/10 rounded-xl p-6 text-gray-400">
                <p>Hover over or click on the image to pick a color.</p>
            </div>
        );
    }

    return (
        <div className="sticky top-8 space-y-6">
            <ColorCodes colorData={colorData} />
            {palettes && <ColorPalettes palettes={palettes} />}
            {activeRgb && <ContrastChecker color1={activeRgb} />}
            {activeRgb && <BlindnessSimulator color={activeRgb} />}
            <HistoryPanel history={history} onSelect={onHistorySelect} />
        </div>
    );
};

const Panel: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white/5 border border-white/10 rounded-xl backdrop-blur-md shadow-lg overflow-hidden">
        <h3 className="text-sm font-bold p-3 bg-white/5 border-b border-white/10">{title}</h3>
        <div className="p-4">
            {children}
        </div>
    </div>
);

ColorInfoPanel.Panel = Panel;
