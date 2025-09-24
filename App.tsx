
import React, { useState, useCallback } from 'react';
import { ImageInput } from './components/ImageInput';
import { ImageViewer } from './components/ImageViewer';
import { ColorInfoPanel } from './components/ColorInfoPanel';
import { RGB, ColorData } from './types';
import { useColorData } from './hooks/useColorData';
import { WelcomeScreen } from './components/WelcomeScreen';

const App: React.FC = () => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [hoveredRgb, setHoveredRgb] = useState<RGB | null>(null);
    const [selectedRgb, setSelectedRgb] = useState<RGB | null>(null);
    const [history, setHistory] = useState<RGB[]>([]);

    const activeRgb = selectedRgb || hoveredRgb;
    const { colorData } = useColorData(activeRgb);

    const handleColorSelect = useCallback((rgb: RGB) => {
        setSelectedRgb(rgb);
        setHistory(prev => [rgb, ...prev.filter(c => c.r !== rgb.r || c.g !== rgb.g || c.b !== rgb.b)].slice(0, 7));
    }, []);
    
    const handleHistorySelect = useCallback((rgb: RGB) => {
        setSelectedRgb(rgb);
    }, []);

    const handleImageLoaded = (src: string) => {
        setImageSrc(src);
        setHoveredRgb(null);
        setSelectedRgb(null);
        setHistory([]);
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] text-gray-200 font-sans antialiased">
            <main className="container mx-auto p-4 lg:p-8">
                <header className="text-center mb-8">
                    <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-lime-400">
                        Chroma Vision
                    </h1>
                    <p className="text-gray-400 mt-2">The Ultimate Client-Side Color Picker</p>
                </header>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-2/3 flex flex-col gap-6">
                        <ImageInput onImageLoaded={handleImageLoaded} />
                        {imageSrc ? (
                            <ImageViewer
                                imageSrc={imageSrc}
                                onHoverColor={setHoveredRgb}
                                onSelectColor={handleColorSelect}
                            />
                        ) : (
                            <WelcomeScreen onImageLoaded={handleImageLoaded} />
                        )}
                    </div>
                    <div className="lg:w-1/3">
                        <ColorInfoPanel 
                            colorData={colorData} 
                            history={history}
                            onHistorySelect={handleHistorySelect}
                            activeRgb={activeRgb}
                        />
                    </div>
                </div>
            </main>
             <footer className="text-center p-6 text-gray-500 text-sm mt-8">
                <p>Built with React, TypeScript, and Tailwind CSS. All processing is done in your browser.</p>
            </footer>
        </div>
    );
};

export default App;
