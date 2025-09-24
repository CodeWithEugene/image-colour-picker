
import React from 'react';
import { ColorData } from '../types';
import { ColorInfoPanel } from './ColorInfoPanel';
import { CopyToClipboardButton } from './CopyToClipboardButton';

interface ColorCodesProps {
    colorData: ColorData;
}

export const ColorCodes: React.FC<ColorCodesProps> = ({ colorData }) => {
    const { hex, rgb, hsl, hsv, cmyk } = colorData;

    const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    const hsvString = `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`;
    const cmykString = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;

    return (
        <ColorInfoPanel.Panel title="Color Codes">
            <div className="flex items-center gap-4 mb-4">
                <div 
                    className="w-16 h-16 rounded-lg border-2 border-white/20 shrink-0"
                    style={{ backgroundColor: hex, boxShadow: `0 0 20px ${hex}` }}
                />
                <div className="grid grid-cols-1 gap-2 w-full">
                    <CodeRow label="HEX" value={hex} />
                    <CodeRow label="RGB" value={rgbString} />
                    <CodeRow label="HSL" value={hslString} />
                    <CodeRow label="HSV" value={hsvString} />
                    <CodeRow label="CMYK" value={cmykString} />
                </div>
            </div>
        </ColorInfoPanel.Panel>
    );
};

const CodeRow: React.FC<{label: string, value: string}> = ({label, value}) => (
    <div className="flex items-center justify-between text-sm bg-black/20 p-2 rounded-md">
       <span className="font-mono text-gray-400 w-12">{label}</span>
       <span className="font-mono text-gray-200 flex-grow">{value}</span>
       <CopyToClipboardButton textToCopy={value} />
    </div>
);
