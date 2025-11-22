import React, { useEffect, useState } from 'react';
import { InstagramIcon, CloseIcon } from '../icons';
import { TEXTS } from '../utils/texts';

interface SocialFollowAlertProps {
    show: boolean;
    onClose: () => void;
}

const INSTAGRAM_URL = "https://www.instagram.com/hce_esquadrias";

const SocialFollowAlert: React.FC<SocialFollowAlertProps> = ({ show, onClose }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (show) {
            const autoCloseTimer = setTimeout(() => {
                handleClose();
            }, 12000);
            return () => clearTimeout(autoCloseTimer);
        }
    }, [show]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onClose();
            setIsExiting(false);
        }, 300);
    };
    
    if (!show) return null;

    return (
        <>
            {/* Desktop Version (Bottom Left Card) */}
            <div 
                className={`hidden md:block relative w-[320px] rounded-2xl bg-white shadow-2xl border border-slate-200/80 transition-all duration-300 ease-in-out ${isExiting ? 'animate-slide-out-left opacity-0' : 'animate-slide-in-left opacity-100'}`}
                role="alert"
            >
                <div className="p-5">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary to-slate-700 rounded-full flex items-center justify-center">
                            <InstagramIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h4 className="font-bold text-heading text-sm">{TEXTS.socialAlert.title}</h4>
                            <p className="text-xs text-body mt-1 leading-tight">
                                {TEXTS.socialAlert.description}
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 flex gap-3">
                        <a 
                            href={INSTAGRAM_URL} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 text-center bg-primary text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors hover:bg-heading"
                            onClick={handleClose}
                        >
                            {TEXTS.socialAlert.buttonFollow}
                        </a>
                        <button 
                            onClick={handleClose}
                            className="flex-shrink-0 text-center bg-slate-100 text-slate-600 font-medium text-xs px-4 py-2 rounded-lg transition-colors hover:bg-slate-200"
                        >
                            {TEXTS.socialAlert.buttonLater}
                        </button>
                    </div>
                </div>
                <button 
                    onClick={handleClose}
                    className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                    aria-label="Fechar alerta"
                >
                    <CloseIcon className="w-3 h-3" />
                </button>
            </div>

            {/* Mobile Version (Top Toast/Banner) - Moves away from bottom congestion */}
            <div 
                className={`md:hidden fixed top-20 left-1/2 -translate-x-1/2 z-[900] w-[90%] max-w-sm bg-white/95 backdrop-blur-md shadow-lg border border-slate-200 rounded-full px-4 py-3 flex items-center justify-between gap-3 transition-all duration-300 ${isExiting ? '-translate-y-20 opacity-0' : 'translate-y-0 opacity-100'}`}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-tr from-purple-500 to-orange-500 rounded-full flex items-center justify-center">
                        <InstagramIcon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-slate-800 truncate">{TEXTS.socialAlert.mobileText}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <a 
                        href={INSTAGRAM_URL} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide"
                        onClick={handleClose}
                    >
                        {TEXTS.socialAlert.buttonFollow}
                    </a>
                    <button onClick={handleClose} className="p-1 text-slate-400">
                        <CloseIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </>
    );
};

export default SocialFollowAlert;