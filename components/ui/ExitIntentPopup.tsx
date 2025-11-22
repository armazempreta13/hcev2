import React, { useEffect, useState } from 'react';
import { CloseIcon, ChatBubbleOvalLeftEllipsisIcon } from '../icons';
import { TEXTS } from '../utils/texts';

interface ExitIntentPopupProps {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
    stackOnTop?: boolean;
}

const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({ show, onClose, onConfirm, stackOnTop = false }) => {
    const [isExiting, setIsExiting] = useState(false);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onClose();
            setIsExiting(false);
        }, 300); // Animation duration
    };

    const handleConfirm = () => {
        onConfirm();
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };
        if (show) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [show]);

    if (!show) {
        return null;
    }

    const positionClass = stackOnTop ? 'bottom-[180px]' : 'bottom-6';

    return (
        <div 
            className={`fixed ${positionClass} left-6 z-[998] w-[calc(100vw-3rem)] max-w-sm rounded-2xl bg-white shadow-2xl border border-slate-200/80 transition-all duration-300 ease-in-out ${isExiting ? 'animate-slide-out-left' : 'animate-slide-in-left'}`}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="exit-intent-title"
            aria-describedby="exit-intent-description"
        >
            <div className="p-5">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-accent/20 text-accent rounded-full flex items-center justify-center">
                        <ChatBubbleOvalLeftEllipsisIcon className="w-7 h-7" />
                    </div>
                    <div>
                        <h4 id="exit-intent-title" className="font-bold text-heading">{TEXTS.exitPopup.title}</h4>
                        <p id="exit-intent-description" className="text-sm text-body mt-1">
                           {TEXTS.exitPopup.description}
                        </p>
                    </div>
                </div>
                <div className="mt-4 flex gap-3">
                    <button
                        onClick={handleConfirm}
                        className="flex-1 text-center bg-primary text-white font-bold text-sm px-4 py-2.5 rounded-lg transition-colors hover:bg-heading"
                    >
                        {TEXTS.exitPopup.buttonChat}
                    </button>
                    <button
                        onClick={handleClose}
                        className="flex-shrink-0 text-center bg-slate-200 text-slate-600 font-medium text-sm px-4 py-2.5 rounded-lg transition-colors hover:bg-slate-300"
                    >
                        {TEXTS.exitPopup.buttonNo}
                    </button>
                </div>
            </div>
             <button
                onClick={handleClose}
                className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                aria-label="Fechar"
            >
                <CloseIcon className="w-4 h-4" />
            </button>
        </div>
    );
};

export default ExitIntentPopup;