
import React from 'react';
import { ColorInfoPanel } from './ColorInfoPanel';
import { CopyToClipboardButton } from './CopyToClipboardButton';

interface ColorPalettesProps {
    palettes: {
        monochromatic: string[];
        analogous: string[];
        triadic: string[];
        complementary: string[];
        tints: string[];
        shades: string[];
    };
}

export const ColorPalettes: React.FC<ColorPalettesProps> = ({ palettes }) => {
    return (
        <ColorInfoPanel.Panel title="Palettes & Variations">
            <div className="space-y-4">
                <PaletteRow title="Complementary" colors={palettes.complementary} />
                <PaletteRow title="Analogous" colors={palettes.analogous} />
                <PaletteRow title="Triadic" colors={palettes.triadic} />
                <PaletteRow title="Tints" colors={palettes.tints} />
                <PaletteRow title="Shades" colors={palettes.shades} />
            </div>
        </ColorInfoPanel.Panel>
    );
};

const PaletteRow: React.FC<{title: string, colors: string[]}> = ({ title, colors }) => (
    <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">{title}</h4>
        <div className="flex gap-2">
            {colors.map((color, index) => (
                <div key={index} className="relative group flex-1">
                    <div
                        className="h-8 rounded"
                        style={{ 
                            backgroundColor: color,
                            boxShadow: `0 0 10px ${color}50`
                        }}
                    ></div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 px-2 py-1 rounded text-xs z-10">
                        {color}
                        <CopyToClipboardButton textToCopy={color} size="sm" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);
