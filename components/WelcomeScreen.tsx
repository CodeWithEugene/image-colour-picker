
import React from 'react';

interface WelcomeScreenProps {
    onImageLoaded: (src: string) => void;
}
const placeholderImages = [
    'https://picsum.photos/seed/picsum1/800/450',
    'https://picsum.photos/seed/picsum2/800/450',
    'https://picsum.photos/seed/picsum3/800/450',
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onImageLoaded }) => {
    
    const handlePlaceholderClick = async (url: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            onImageLoaded(objectUrl);
        } catch (error) {
            console.error("Error loading placeholder image:", error);
        }
    };
    
    return (
        <div className="flex flex-col items-center justify-center aspect-video w-full bg-white/5 border border-white/10 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-200">Get Started</h2>
            <p className="text-gray-400 mt-2 mb-6">Upload an image to begin picking colors.</p>
            <p className="text-gray-400 mt-2 mb-2">Or try one of these examples:</p>
            <div className="flex gap-4">
                {placeholderImages.map((src, idx) => (
                    <img 
                        key={idx}
                        src={src}
                        alt={`Placeholder ${idx + 1}`}
                        className="w-32 h-20 object-cover rounded-lg cursor-pointer border-2 border-transparent hover:border-cyan-400 transition-all"
                        onClick={() => handlePlaceholderClick(src)}
                    />
                ))}
            </div>
        </div>
    );
};
