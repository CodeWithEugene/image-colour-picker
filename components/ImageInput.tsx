
import React, { useState, useCallback, useRef, DragEvent } from 'react';
import { Icon } from './Icon';

interface ImageInputProps {
    onImageLoaded: (src: string) => void;
}

export const ImageInput: React.FC<ImageInputProps> = ({ onImageLoaded }) => {
    const [url, setUrl] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processFile = useCallback((file: File) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    onImageLoaded(e.target.result as string);
                    setError(null);
                }
            };
            reader.readAsDataURL(file);
        } else {
            setError('Please select a valid image file.');
        }
    }, [onImageLoaded]);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const handleUrlSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;
        setError(null);
        try {
            const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
            if (!response.ok) throw new Error('Network response was not ok.');
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            onImageLoaded(objectUrl);
        } catch (err) {
            setError('Could not fetch image. Check URL and CORS policy.');
            console.error(err);
        }
    };
    
    const handlePaste = useCallback((e: ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (!items) return;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                if(file) processFile(file);
                break;
            }
        }
    }, [processFile]);

    React.useEffect(() => {
        window.addEventListener('paste', handlePaste);
        return () => {
            window.removeEventListener('paste', handlePaste);
        };
    }, [handlePaste]);

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };


    return (
        <div 
            className={`relative bg-white/5 border border-dashed rounded-xl p-6 transition-all duration-300 ${isDragging ? 'border-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.4)]' : 'border-white/20'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-center md:text-left">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-3 justify-center w-full md:w-auto px-4 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 transition-all duration-300"
                    >
                        <Icon name="upload" />
                        <span>Upload an image</span>
                    </button>
                    <p className="text-xs text-gray-400 mt-2">or drag & drop, or paste from clipboard.</p>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                </div>
                <div className="text-gray-500">OR</div>
                <form onSubmit={handleUrlSubmit} className="flex-1 w-full md:w-auto">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Enter image URL"
                            className="w-full px-3 py-2 bg-black/20 rounded-lg border border-white/10 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
                        />
                         <button type="submit" className="p-2.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 transition-all duration-300">
                           <Icon name="link" />
                         </button>
                    </div>
                </form>
            </div>
            {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}
        </div>
    );
};
