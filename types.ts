
export interface RGB { r: number; g: number; b: number; }
export interface HSL { h: number; s: number; l: number; }
export interface HSV { h: number; s: number; v: number; }
export interface CMYK { c: number; m: number; y: number; k: number; }

export interface ColorData {
  rgb: RGB;
  hex: string;
  hsl: HSL;
  hsv: HSV;
  cmyk: CMYK;
}

export type BlindnessType = 'protanopia' | 'deuteranopia' | 'tritanopia';
