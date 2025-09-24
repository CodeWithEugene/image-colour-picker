
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
    const signature = 'Made with ❤️ by Eugenius: @https://codewitheugene.top/';

    const triggerDownload = (filename: string, content: string, mime: string) => {
        const blob = new Blob([content], { type: mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const uniqueFlatten = (arrays: string[][]): string[] => {
        const seen = new Set<string>();
        const out: string[] = [];
        for (const arr of arrays) {
            for (const c of arr) {
                if (!seen.has(c)) {
                    seen.add(c);
                    out.push(c);
                }
            }
        }
        return out;
    };

    const handleDownloadJSON = () => {
        const payload = {
            palettes,
            combined: uniqueFlatten(Object.values(palettes)),
            meta: {
                app: 'Chroma Vision',
                exportedAt: new Date().toISOString(),
                format: 'hex',
                signature
            }
        };
        triggerDownload('palette.json', JSON.stringify(payload, null, 2), 'application/json');
    };

    const handleDownloadTXT = () => {
        const combined = uniqueFlatten(Object.values(palettes));
        const content = combined.join('\n') + `\n\n${signature}`;
        triggerDownload('palette.txt', content, 'text/plain');
    };

    const handleDownloadPNG = () => {
        const colors = uniqueFlatten(Object.values(palettes));
        if (colors.length === 0) return;

        const cols = Math.min(colors.length, 10);
        const rows = Math.ceil(colors.length / cols);
        const tile = 56; // swatch size
        const gap = 12;
        const labelH = 16;
        const padding = 24;
        const footerH = 28; // space for signature

        const width = padding * 2 + cols * tile + (cols - 1) * gap;
        const height = padding * 2 + rows * (tile + labelH) + (rows - 1) * gap + footerH;

        const canvas = document.createElement('canvas');
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.scale(dpr, dpr);

        // Background
        ctx.fillStyle = '#0b0b0d';
        ctx.fillRect(0, 0, width, height);

        // Title
        ctx.fillStyle = '#e5e7eb';
        ctx.font = 'bold 14px system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial';
        const title = 'Chroma Vision Palette';
        ctx.fillText(title, padding, padding - 8);

        // Draw swatches
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.font = '12px system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial';
        colors.forEach((hex, i) => {
            const c = i % cols;
            const r = Math.floor(i / cols);
            const x = padding + c * (tile + gap);
            const y = padding + r * (tile + labelH + gap);

            // Swatch
            ctx.fillStyle = hex;
            ctx.fillRect(x, y, tile, tile);

            // Border
            ctx.strokeStyle = 'rgba(255,255,255,0.15)';
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 0.5, y + 0.5, tile - 1, tile - 1);

            // Label
            // Choose contrasting text color for readability
            const textColor = getReadableTextColor(hex);
            ctx.fillStyle = textColor;
            ctx.fillText(hex.toUpperCase(), x + tile / 2, y + tile + 2);
        });

        // Signature footer
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.font = '12px system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial';
        ctx.fillStyle = '#9ca3af';
        ctx.fillText(signature, width / 2, height - padding);

        const dataUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'palette.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const getReadableTextColor = (hex: string) => {
        // hex like #RRGGBB
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        // luminance approximation
        const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        return lum > 140 ? '#0b0b0d' : '#f9fafb';
    };

    return (
        <ColorInfoPanel.Panel title="Palettes & Variations">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-400">Download your palette</div>
                    <div className="flex gap-2">
                        <button onClick={handleDownloadJSON} className="px-2 py-1 text-xs rounded bg-white/10 hover:bg-white/15 border border-white/10">JSON</button>
                        <button onClick={handleDownloadTXT} className="px-2 py-1 text-xs rounded bg-white/10 hover:bg-white/15 border border-white/10">TXT</button>
                        <button onClick={handleDownloadPNG} className="px-2 py-1 text-xs rounded bg-white/10 hover:bg-white/15 border border-white/10">PNG</button>
                    </div>
                </div>
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
