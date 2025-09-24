
import React from 'react';
import { RGB } from '../types';
import { rgbToHex } from '../utils/colorConverter';
import { ColorInfoPanel } from './ColorInfoPanel';

interface HistoryPanelProps {
    history: RGB[];
    onSelect: (rgb: RGB) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect }) => {
    if (history.length === 0) return null;

    return (
        <ColorInfoPanel.Panel title="History">
            <div className="flex flex-wrap gap-2">
                {history.map((rgb, index) => (
                    <button
                        key={`${rgb.r}-${rgb.g}-${rgb.b}-${index}`}
                        onClick={() => onSelect(rgb)}
                        className="w-8 h-8 rounded-full border-2 border-white/20 hover:border-cyan-400 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        style={{ backgroundColor: rgbToHex(rgb) }}
                        aria-label={`Select color ${rgbToHex(rgb)}`}
                    />
                ))}
            </div>
        </ColorInfoPanel.Panel>
    );
};
