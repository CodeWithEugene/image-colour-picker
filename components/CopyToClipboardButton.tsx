
import React, { useState } from 'react';
import { Icon } from './Icon';

interface CopyToClipboardButtonProps {
    textToCopy: string;
    size?: 'sm' | 'md';
}

export const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({ textToCopy, size = 'md' }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const sizeClasses = size === 'sm' ? 'p-1' : 'p-1.5';

    return (
        <button
            onClick={handleCopy}
            className={`transition-colors rounded-md ${sizeClasses} ${copied ? 'text-lime-400' : 'text-gray-500 hover:text-gray-300'}`}
            aria-label="Copy to clipboard"
        >
            {copied ? <Icon name="check" /> : <Icon name="copy" />}
        </button>
    );
};
