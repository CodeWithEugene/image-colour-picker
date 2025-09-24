
import React, { useState, useMemo } from 'react';
import { RGB } from '../types';
import { calculateContrastRatio, hexToRgb, rgbToHex } from '../utils/colorConverter';
import { ColorInfoPanel } from './ColorInfoPanel';

interface ContrastCheckerProps {
    color1: RGB;
}

export const ContrastChecker: React.FC<ContrastCheckerProps> = ({ color1 }) => {
    const [color2, setColor2] = useState<RGB>({ r: 255, g: 255, b: 255 });

    const contrastRatio = useMemo(() => calculateContrastRatio(color1, color2), [color1, color2]);

    const handleColor2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rgb = hexToRgb(e.target.value);
        if (rgb) {
            setColor2(rgb);
        }
    };
    
    const checkAA = contrastRatio >= 4.5;
    const checkAALarge = contrastRatio >= 3;
    const checkAAA = contrastRatio >= 7;
    const checkAAALarge = contrastRatio >= 4.5;

    return (
        <ColorInfoPanel.Panel title="Accessibility Contrast">
            <div className="flex items-center gap-4">
                <div className="flex-1 flex flex-col items-center justify-center p-4 rounded-lg" style={{ backgroundColor: rgbToHex(color2), color: rgbToHex(color1) }}>
                    <span className="font-bold">Text</span>
                    <span className="text-xs">Background</span>
                </div>
                <div className="flex-1 flex flex-col items-center">
                    <div className="text-3xl font-bold">{contrastRatio.toFixed(2)}</div>
                    <div className="text-xs text-gray-400">Ratio</div>
                </div>
                <div className="flex-1">
                    <input type="color" value={rgbToHex(color2)} onChange={handleColor2Change} className="w-full h-10 p-0 border-none rounded cursor-pointer bg-transparent" />
                    <span className="text-xs text-center block mt-1 text-gray-400">{rgbToHex(color2)}</span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                <ResultBadge label="AA Normal" passed={checkAA} />
                <ResultBadge label="AAA Normal" passed={checkAAA} />
                <ResultBadge label="AA Large" passed={checkAALarge} />
                <ResultBadge label="AAA Large" passed={checkAAALarge} />
            </div>
        </ColorInfoPanel.Panel>
    );
};

const ResultBadge: React.FC<{label: string, passed: boolean}> = ({label, passed}) => (
    <div className={`flex justify-between items-center p-2 rounded ${passed ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
        <span>{label}</span>
        <span className="font-bold">{passed ? 'PASS' : 'FAIL'}</span>
    </div>
)
