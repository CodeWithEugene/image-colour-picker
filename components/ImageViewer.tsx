
import React, { useRef, useEffect, useState, MouseEvent } from 'react';
import { RGB } from '../types';

interface ImageViewerProps {
    imageSrc: string;
    onHoverColor: (rgb: RGB) => void;
    onSelectColor: (rgb: RGB) => void;
}

const MAGNIFIER_SIZE = 120;
const ZOOM_LEVEL = 5;

export const ImageViewer: React.FC<ImageViewerProps> = ({ imageSrc, onHoverColor, onSelectColor }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [cursorPos, setCursorPos] = useState({ x: -1, y: -1 });
    const [isMouseOver, setIsMouseOver] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d', { willReadFrequently: true });
        if (!canvas || !context) return;

        const image = new Image();
        image.crossOrigin = "Anonymous";
        image.src = imageSrc;
        image.onload = () => {
            const container = containerRef.current;
            if (!container) return;

            const containerWidth = container.offsetWidth;
            const aspectRatio = image.width / image.height;
            const cssWidth = containerWidth;
            const cssHeight = containerWidth / aspectRatio;

            // Handle HiDPI: set backing store size scaled by devicePixelRatio
            const dpr = window.devicePixelRatio || 1;
            canvas.style.width = `${cssWidth}px`;
            canvas.style.height = `${cssHeight}px`;
            canvas.width = Math.round(cssWidth * dpr);
            canvas.height = Math.round(cssHeight * dpr);

            // Scale drawing context so 1 unit = 1 CSS pixel
            context.setTransform(dpr, 0, 0, dpr, 0, 0);
            context.imageSmoothingEnabled = false;
            context.drawImage(image, 0, 0, cssWidth, cssHeight);
        };
    }, [imageSrc]);

    const handleMouseEvent = (e: MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (!canvas || !context) return;

        const rect = canvas.getBoundingClientRect();
        const cssX = e.clientX - rect.left;
        const cssY = e.clientY - rect.top;

        // Clamp to canvas CSS size
        const cssWidth = rect.width;
        const cssHeight = rect.height;
        const clampedCssX = Math.min(Math.max(cssX, 0), cssWidth - 1);
        const clampedCssY = Math.min(Math.max(cssY, 0), cssHeight - 1);

        // Map CSS pixels to backing store pixels
        const dpr = window.devicePixelRatio || 1;
        const pixelX = Math.floor(clampedCssX * dpr);
        const pixelY = Math.floor(clampedCssY * dpr);

        // Read exact pixel
        const pixel = context.getImageData(pixelX, pixelY, 1, 1).data;
        const rgb: RGB = { r: pixel[0], g: pixel[1], b: pixel[2] };

        onHoverColor(rgb);
        setCursorPos({ x: clampedCssX, y: clampedCssY });

        if (e.type === 'click') {
            onSelectColor(rgb);
        }
    };
    
    return (
        <div ref={containerRef} className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl shadow-black/50">
            <canvas
                ref={canvasRef}
                onMouseMove={handleMouseEvent}
                onClick={handleMouseEvent}
                onMouseEnter={() => setIsMouseOver(true)}
                onMouseLeave={() => setIsMouseOver(false)}
                className="cursor-crosshair w-full h-full object-contain"
            />
            {isMouseOver && cursorPos.x !== -1 && (
                <div
                    className="absolute pointer-events-none rounded-full border-4 border-white/50 shadow-lg bg-no-repeat"
                    style={{
                        left: cursorPos.x - MAGNIFIER_SIZE / 2,
                        top: cursorPos.y - MAGNIFIER_SIZE / 2,
                        width: MAGNIFIER_SIZE,
                        height: MAGNIFIER_SIZE,
                        backgroundImage: `url(${canvasRef.current?.toDataURL()})`,
                        backgroundPosition: `${-cursorPos.x * ZOOM_LEVEL + MAGNIFIER_SIZE / 2}px ${-cursorPos.y * ZOOM_LEVEL + MAGNIFIER_SIZE / 2}px`,
                        backgroundSize: `${(canvasRef.current?.width || 0) / (window.devicePixelRatio || 1) * ZOOM_LEVEL}px ${(canvasRef.current?.height || 0) / (window.devicePixelRatio || 1) * ZOOM_LEVEL}px`,
                        imageRendering: 'pixelated',
                    }}
                >
                    <div className="absolute w-full h-full flex items-center justify-center">
                        <div className="w-[2px] h-full bg-white/30"></div>
                        <div className="absolute w-full h-[2px] bg-white/30"></div>
                    </div>
                </div>
            )}
        </div>
    );
};
