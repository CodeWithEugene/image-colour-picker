
import { RGB, HSL, HSV, CMYK, BlindnessType } from '../types';

export function rgbToHex({ r, g, b }: RGB): string {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

export function hexToRgb(hex: string): RGB | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : null;
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslToRgb({ h, s, l }: HSL): RGB {
    s /= 100; l /= 100; h /= 360;
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

export function rgbToHsv({ r, g, b }: RGB): HSV {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, v = max;
    const d = max - min;
    s = max === 0 ? 0 : d / max;
    if (max !== min) {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
}

export function rgbToCmyk({ r, g, b }: RGB): CMYK {
    let c = 1 - (r / 255);
    let m = 1 - (g / 255);
    let y = 1 - (b / 255);
    let k = Math.min(c, m, y);
    if (k === 1) {
        c = m = y = 0;
    } else {
        c = (c - k) / (1 - k);
        m = (m - k) / (1 - k);
        y = (y - k) / (1 - k);
    }
    return { 
        c: Math.round(c * 100), 
        m: Math.round(m * 100), 
        y: Math.round(y * 100), 
        k: Math.round(k * 100) 
    };
}

export function getLuminance({ r, g, b }: RGB): number {
    const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function calculateContrastRatio(rgb1: RGB, rgb2: RGB): number {
    const lum1 = getLuminance(rgb1);
    const lum2 = getLuminance(rgb2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
}

// Color blindness simulation matrices
const protanopiaMatrix = [
    [0.567, 0.433, 0],
    [0.558, 0.442, 0],
    [0, 0.242, 0.758]
];
const deuteranopiaMatrix = [
    [0.625, 0.375, 0],
    [0.7, 0.3, 0],
    [0, 0.3, 0.7]
];
const tritanopiaMatrix = [
    [0.95, 0.05, 0],
    [0, 0.433, 0.567],
    [0, 0.475, 0.525]
];

function applyMatrix(rgb: RGB, matrix: number[][]): RGB {
    const { r, g, b } = rgb;
    const newR = r * matrix[0][0] + g * matrix[0][1] + b * matrix[0][2];
    const newG = r * matrix[1][0] + g * matrix[1][1] + b * matrix[1][2];
    const newB = r * matrix[2][0] + g * matrix[2][1] + b * matrix[2][2];
    return {
        r: Math.max(0, Math.min(255, Math.round(newR))),
        g: Math.max(0, Math.min(255, Math.round(newG))),
        b: Math.max(0, Math.min(255, Math.round(newB))),
    };
}

export function simulateBlindness(rgb: RGB, type: BlindnessType): RGB {
    switch (type) {
        case 'protanopia': return applyMatrix(rgb, protanopiaMatrix);
        case 'deuteranopia': return applyMatrix(rgb, deuteranopiaMatrix);
        case 'tritanopia': return applyMatrix(rgb, tritanopiaMatrix);
        default: return rgb;
    }
}
