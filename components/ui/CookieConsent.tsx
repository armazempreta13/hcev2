import React, { useState, useEffect, forwardRef, useRef } from 'react';
import { Link } from 'react-router-dom';
import { TEXTS } from '../utils/texts';

interface CookieConsentProps {
    show: boolean;
    onAcceptAll: () => void;
    onAcceptNecessary: () => void;
    onOpenPreferences: () => void;
    onVisibilityChange?: (visible: boolean) => void;
}

const CookieConsent = forwardRef<HTMLDivElement, CookieConsentProps>(({ show, onAcceptAll, onAcceptNecessary, onOpenPreferences, onVisibilityChange }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const interactionTimerRef = useRef<number | null>(null);
    const reminderTimerRef = useRef<number | null>(null);

    const DISPLAY_DURATION = 15000;
    const HIDE_DURATION = 30000;

    useEffect(() => {
        if (show) {
            startCycle();
        } else {
            setIsVisible(false);
            clearTimers();
        }
        return () => clearTimers();
    }, [show]);

    useEffect(() => {
        onVisibilityChange?.(isVisible);
    }, [isVisible, onVisibilityChange]);

    const clearTimers = () => {
        if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
        if (reminderTimerRef.current) clearTimeout(reminderTimerRef.current);
    };

    const startCycle = () => {
        clearTimers();
        setIsVisible(true);
        interactionTimerRef.current = window.setTimeout(() => {
            setIsVisible(false);
            reminderTimerRef.current = window.setTimeout(() => {
                startCycle();
            }, HIDE_DURATION);
        }, DISPLAY_DURATION);
    };

    const handleMouseEnter = () => {
        clearTimers();
        setIsVisible(true);
    };

    const handleMouseLeave = () => {
        if (show) startCycle();
    };

    if (!show) return null;

    return (
        <div
            ref={ref}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`fixed bottom-0 left-0 w-full z-[1100] bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-in-out transform ${isVisible ? 'translate-y-0' : 'translate-y-[110%]'}`}
            role="dialog"
            aria-live="polite"
            aria-labelledby="cookie-consent-title"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6">
                    
                    {/* Texto - Versão Simplificada Mobile / Completa Desktop */}
                    <div className="text-center lg:text-left w-full lg:w-auto">
                        <p className="text-xs md:text-sm text-slate-600 leading-relaxed hidden md:block">
                            {TEXTS.cookieBanner.textDesktop}{' '}
                            <Link to="/politica-de-privacidade" className="font-semibold text-accent hover:text-accent-dark underline transition-colors">
                                {TEXTS.footer.links.privacy}
                            </Link>.
                        </p>
                        {/* Texto Mobile Super Curto */}
                        <p className="text-xs text-slate-600 md:hidden text-center">
                            {TEXTS.cookieBanner.textMobile}{' '}
                            <Link to="/politica-de-privacidade" className="underline text-primary">{TEXTS.global.buttons.learnMore}</Link>.
                        </p>
                    </div>

                    {/* Botões - Compacto no Mobile */}
                    <div className="w-full lg:w-auto flex-shrink-0">
                         {/* Mobile Layout: Grid 2 colunas (Lado a Lado) */}
                         <div className="grid grid-cols-2 gap-3 md:hidden">
                            <button 
                                type="button"
                                onClick={onOpenPreferences} 
                                className="w-full bg-slate-100 text-slate-600 text-xs font-bold py-3 rounded-lg border border-slate-200 active:scale-95 transition-transform"
                            >
                                {TEXTS.cookieBanner.buttons.customize}
                            </button>
                            <button 
                                type="button"
                                onClick={onAcceptAll} 
                                className="w-full bg-primary text-white text-xs font-bold py-3 rounded-lg shadow-md active:scale-95 transition-transform shimmer-effect"
                            >
                                {TEXTS.cookieBanner.buttons.accept}
                            </button>
                         </div>

                         {/* Desktop Layout: Flex Row Completo */}
                         <div className="hidden md:flex flex-row gap-3">
                            <button 
                                type="button"
                                onClick={onOpenPreferences} 
                                className="text-sm font-semibold text-slate-500 hover:text-primary underline py-2 px-3 transition-colors"
                            >
                                {TEXTS.cookieBanner.buttons.customize}
                            </button>
                            <button 
                                type="button"
                                onClick={onAcceptNecessary} 
                                className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-bold py-2.5 px-5 rounded-full transition-all duration-300 active:scale-95"
                            >
                                {TEXTS.cookieBanner.buttons.necessary}
                            </button>
                            <button 
                                type="button"
                                onClick={onAcceptAll} 
                                className="bg-primary hover:bg-heading text-white text-sm font-bold py-2.5 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-primary/30 hover:scale-105 active:scale-95 shimmer-effect"
                            >
                                {TEXTS.cookieBanner.buttons.acceptAll}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default CookieConsent;