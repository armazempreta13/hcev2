
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { ChatBubbleOvalLeftEllipsisIcon, CloseIcon, ArrowUpIcon } from './icons';
import { Tooltip } from './ui/Tooltip';
import { IMAGES } from './utils/images';
import { CONFIG } from './utils/config';

const Chatbot = lazy(() => import('./Chatbot'));

const messages = [
    "Posso te ajudar?",
    "Fazer um orçamento?",
    "Tire suas dúvidas 💡",
    "Estou online!",
    "Chamar no WhatsApp?",
    "Ver projetos?",
    "Falar com especialista?",
    "Oi! Tudo bem? 👋",
    "Precisa de uma dica?",
    "Vamos conversar!"
];

interface FloatingActionsProps {
    isChatOpen: boolean;
    toggleChat: () => void;
    hasInteracted: boolean;
    isCookieBannerVisible: boolean;
}

const FloatingActions: React.FC<FloatingActionsProps> = ({ isChatOpen, toggleChat, hasInteracted, isCookieBannerVisible }) => {
    const [isChatMounted, setIsChatMounted] = useState(false);
    const [messageIndex, setMessageIndex] = useState(0);
    const [showBubble, setShowBubble] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [attentionAnimation, setAttentionAnimation] = useState(false);

    // Mount the chatbot component on the first open and keep it mounted
    useEffect(() => {
        if (isChatOpen && !isChatMounted && CONFIG.features.chatbot) {
            setIsChatMounted(true);
        }
    }, [isChatOpen, isChatMounted]);

    // Logic for Attention Grabbing (Shake + Bubble Synchronized)
    useEffect(() => {
        if (!CONFIG.features.chatbot) return;

        if (isChatOpen) {
            setShowBubble(false);
            setAttentionAnimation(false);
            return;
        }

        const triggerAttention = () => {
            if (document.hidden) return;

            setAttentionAnimation(true);
            setTimeout(() => setAttentionAnimation(false), 1500);

            setShowBubble(true);
            
            // Hide bubble after 5 seconds
            setTimeout(() => setShowBubble(false), 6000);
            
            // Change message after bubble hides (wait for exit animation)
            setTimeout(() => setMessageIndex(prev => (prev + 1) % messages.length), 6500);
        };

        const initialTimer = setTimeout(triggerAttention, 3000);
        const intervalId = setInterval(triggerAttention, 15000);

        return () => {
            clearTimeout(initialTimer);
            clearInterval(intervalId);
        };
    }, [isChatOpen, hasInteracted]);
    
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);

            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight;
            const winHeight = window.innerHeight;
            const scrollableHeight = docHeight - winHeight;

            setScrollProgress(scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const svgSize = 48;
    const strokeWidth = 4;
    const radius = (svgSize - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (scrollProgress / 100) * circumference;

    return (
        <>
            {/* Adjusted bottom position for mobile when cookie banner is visible: reduced to 110px to fit new compact banner */}
            <div className={`fixed right-6 sm:right-8 z-[999] flex flex-col items-center gap-4 transition-all duration-500 ease-in-out ${isCookieBannerVisible ? 'bottom-[110px] sm:bottom-[120px]' : 'bottom-6 sm:bottom-8'}`}>
                 {/* Scroll to Top Button */}
                 {CONFIG.features.scrollTopButton && (
                    <div className={`transition-all duration-500 ease-out ${showScrollTop && !isChatOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                         <Tooltip content="Voltar ao Topo" position="left">
                            <button
                                onClick={scrollToTop}
                                className="relative w-12 h-12 bg-primary hover:bg-heading rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-soft-gray focus:ring-accent"
                                aria-label="Voltar ao topo"
                            >
                                <ArrowUpIcon className="w-5 h-5 z-10" />
                                <svg className="absolute top-0 left-0 w-full h-full" viewBox={`0 0 ${svgSize} ${svgSize}`} aria-hidden="true">
                                    <circle className="stroke-white/20" strokeWidth={strokeWidth} fill="transparent" r={radius} cx={svgSize / 2} cy={svgSize / 2} />
                                    <circle
                                        className="stroke-accent"
                                        strokeWidth={strokeWidth}
                                        strokeLinecap="round"
                                        fill="transparent"
                                        r={radius}
                                        cx={svgSize / 2}
                                        cy={svgSize / 2}
                                        style={{
                                            strokeDasharray: circumference,
                                            strokeDashoffset: offset,
                                            transform: 'rotate(-90deg)',
                                            transformOrigin: '50% 50%',
                                            transition: 'stroke-dashoffset 0.1s linear'
                                        }}
                                    />
                                </svg>
                            </button>
                        </Tooltip>
                    </div>
                )}

                {/* Chat Button Container */}
                {CONFIG.features.chatbot && (
                    <div className="relative flex items-center justify-end group">
                        
                        {/* Premium iOS-Style Notification Bubble */}
                        <div 
                            className={`
                                absolute right-full mr-5 top-1/2 -translate-y-1/2 z-50
                                origin-right will-change-transform
                                ${showBubble && !isChatOpen 
                                    ? 'opacity-100 scale-100 translate-x-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]' 
                                    : 'opacity-0 scale-90 translate-x-4 pointer-events-none transition-all duration-200 ease-in'}
                            `}
                            aria-hidden={!showBubble || isChatOpen}
                            onClick={toggleChat}
                        >
                            {/* Shadow Wrapper - Optimized */}
                            <div className="filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] cursor-pointer">
                                <div className="relative bg-white/95 backdrop-blur-sm flex items-center gap-3 pl-3 pr-5 py-3 rounded-[20px] border border-white/50">
                                    {/* Avatar Circle */}
                                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                                        <img 
                                            src={IMAGES.identity.logoWhite} 
                                            alt="HCE" 
                                            className="w-7 h-7 object-contain opacity-90" 
                                        />
                                    </div>
                                    
                                    {/* Text Content */}
                                    <div className="flex flex-col justify-center min-w-[100px]">
                                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider leading-tight mb-0.5">
                                            Ester
                                        </span>
                                        <span className="text-[14px] font-semibold text-slate-800 leading-tight whitespace-nowrap">
                                            {messages[messageIndex]}
                                        </span>
                                    </div>

                                    {/* iOS Tail (Triangle) */}
                                    <div className="absolute top-1/2 -right-1.5 w-3 h-3 bg-white/95 backdrop-blur-sm transform -translate-y-1/2 rotate-45 rounded-[1px] border-t border-r border-white/50"></div>
                                </div>
                            </div>
                        </div>

                        {/* Main FAB Button */}
                        <div className="relative z-20">
                            <button
                                onClick={toggleChat}
                                className={`
                                    relative w-16 h-16 sm:w-[70px] sm:h-[70px] rounded-full shadow-2xl flex items-center justify-center text-primary 
                                    transition-all duration-300 active:scale-90 focus:outline-none z-10
                                    ${isChatOpen ? 'bg-slate-200 hover:bg-slate-300' : 'bg-accent hover:bg-accent-dark hover:scale-110'}
                                    ${attentionAnimation ? 'animate-shake' : ''}
                                `}
                                aria-label={isChatOpen ? "Fechar assistente virtual" : "Abrir assistente virtual"}
                            >
                                {isChatOpen ? (
                                    <CloseIcon className="w-7 h-7 animate-[icon-pop_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)] text-slate-600" />
                                ) : (
                                    <>
                                        <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8 sm:w-9 sm:h-9 animate-[icon-pop_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)] drop-shadow-sm"/>
                                        
                                        {/* Notification Badge */}
                                        {!hasInteracted && (
                                            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-6 w-6 z-20">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-6 w-6 bg-red-500 border-2 border-white text-white text-lg font-extrabold items-center justify-center shadow-sm">
                                                    !
                                                </span>
                                            </span>
                                        )}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Custom Animations */}
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: rotate(0deg) scale(1); }
                    10% { transform: rotate(-12deg) scale(1.15); }
                    20% { transform: rotate(12deg) scale(1.15); }
                    30% { transform: rotate(-12deg) scale(1.15); }
                    40% { transform: rotate(12deg) scale(1.15); }
                    50% { transform: rotate(0deg) scale(1.05); }
                }
                @keyframes icon-pop {
                    0% { transform: scale(0.5) rotate(-90deg); opacity: 0; }
                    60% { transform: scale(1.15) rotate(10deg); opacity: 1; }
                    100% { transform: scale(1) rotate(0deg); opacity: 1; }
                }
                .animate-shake {
                    animation: shake 1.2s ease-in-out;
                }
            `}</style>

            {isChatMounted && (
                <Suspense fallback={null}>
                    <Chatbot isOpen={isChatOpen} onClose={toggleChat} isCookieBannerVisible={isCookieBannerVisible} />
                </Suspense>
            )}
        </>
    );
};

export default FloatingActions;
