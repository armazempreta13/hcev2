
import React, { useRef, useState, useEffect } from 'react';
import { useParallax } from './hooks';
import AnimatedGridBackground from './AnimatedGridBackground';
import { CONFIG } from '../utils/config';

interface ImmersiveSectionProps {
    backgroundImage: string;
    children: React.ReactNode;
    className?: string;
}

const ImmersiveSection: React.FC<ImmersiveSectionProps> = ({ backgroundImage, children, className = '' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isImageReady, setIsImageReady] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    
    // Pass enabled flag to useParallax based on config
    const parallaxBgRef = useParallax(0.15, isVisible && isImageReady && CONFIG.ui.enableParallax);
    const imagePreloadRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { rootMargin: '300px', threshold: 0 }
        );

        const currentSection = sectionRef.current;
        if (currentSection) {
            observer.observe(currentSection);
        }

        return () => {
            if (currentSection) {
                observer.unobserve(currentSection);
            }
        };
    }, []);

    useEffect(() => {
        if (isVisible && !imagePreloadRef.current) {
            const img = new Image();
            img.src = backgroundImage;
            img.onload = () => {
                setIsImageReady(true);
                imagePreloadRef.current = img;
            };
            // Handle error or load anyway to show fallback gradient
            img.onerror = () => {
                 setIsImageReady(false); 
            }
        }
    }, [isVisible, backgroundImage]);

    return (
        <section ref={sectionRef} className={`relative bg-primary py-24 md:py-40 text-white overflow-hidden ${className}`}>
            {/* Parallax Background Image */}
            <div 
                ref={parallaxBgRef} 
                className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 blur-sm scale-110" 
                style={{ 
                    backgroundImage: isImageReady ? `url(${backgroundImage})` : 'none',
                    opacity: isImageReady ? 1 : 0,
                    willChange: isImageReady ? 'transform' : 'auto',
                    maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
                }}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-heading/90 to-primary/95"></div>
            
            {/* Animated Particles - Conditional Rendering */}
            {CONFIG.ui.enableParticles && <AnimatedGridBackground />}
            
            {/* Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {children}
            </div>

             {/* Decorative Elements */}
             <div className="absolute top-10 left-10 w-32 h-32 border-2 border-accent/20 rounded-full pointer-events-none"></div>
             <div className="absolute bottom-10 right-10 w-40 h-40 border-2 border-accent/20 rounded-full pointer-events-none"></div>
        </section>
    );
};

export default ImmersiveSection;
