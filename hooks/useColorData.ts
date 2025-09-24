
import { useMemo } from 'react';
import { RGB, ColorData, HSL } from '../types';
import { rgbToHex, rgbToHsl, rgbToHsv, rgbToCmyk, hslToRgb } from '../utils/colorConverter';

export const useColorData = (rgb: RGB | null) => {
    const colorData: ColorData | null = useMemo(() => {
        if (!rgb) return null;
        return {
            rgb,
            hex: rgbToHex(rgb),
            hsl: rgbToHsl(rgb),
            hsv: rgbToHsv(rgb),
            cmyk: rgbToCmyk(rgb),
        };
    }, [rgb]);

    const palettes = useMemo(() => {
        if (!colorData) return null;

        const { hsl } = colorData;

        const generatePalette = (h_mod: number, s_mod: (s: number) => number, l_mod: (l: number) => number) => 
            rgbToHex(hslToRgb({ h: (hsl.h + h_mod) % 360, s: s_mod(hsl.s), l: l_mod(hsl.l) }));

        const monochromatic = [0.8, 0.6, 0.4, 0.2].map(factor => generatePalette(0, s => s, l => l * factor));
        const analogous = [generatePalette(-30, s => s, l => l), generatePalette(30, s => s, l => l)];
        const triadic = [generatePalette(120, s => s, l => l), generatePalette(240, s => s, l => l)];
        const complementary = generatePalette(180, s => s, l => l);

        const tints = [0.2, 0.4, 0.6, 0.8].map(factor => rgbToHex(hslToRgb({ h: hsl.h, s: hsl.s, l: hsl.l + (100 - hsl.l) * factor })));
        const shades = [0.2, 0.4, 0.6, 0.8].map(factor => rgbToHex(hslToRgb({ h: hsl.h, s: hsl.s, l: hsl.l * (1 - factor) })));

        return {
            monochromatic,
            analogous,
            triadic,
            complementary: [complementary],
            tints,
            shades,
        };
    }, [colorData]);

    return { colorData, palettes };
};
