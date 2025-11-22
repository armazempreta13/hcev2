
import { useEffect, useRef } from 'react';

export const useFocusTrap = (isOpen: boolean) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lastFocusedElementRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!isOpen || !containerRef.current) return;

        lastFocusedElementRef.current = document.activeElement as HTMLElement;

        const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Delay focus to allow modal animation to complete
        const focusTimeout = setTimeout(() => firstElement.focus(), 100);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) { // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else { // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        };

        const currentContainer = containerRef.current;
        currentContainer.addEventListener('keydown', handleKeyDown);

        return () => {
            clearTimeout(focusTimeout);
            currentContainer.removeEventListener('keydown', handleKeyDown);
            lastFocusedElementRef.current?.focus();
        };
    }, [isOpen]);

    return containerRef;
};

export const useParallax = (speed: number, enabled: boolean) => {
    const ref = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        if (!enabled || !ref.current) {
            return;
        }

        let ticking = false;
        const element = ref.current;
        const parent = element.parentElement;
        
        if (!parent) return;

        const update = () => {
            const elementTop = parent.offsetTop;
            const elementHeight = parent.offsetHeight;
            const viewportHeight = window.innerHeight;
            const scrollY = window.pageYOffset;
            
            // Check if element is in view (with some buffer)
            if (scrollY + viewportHeight > elementTop && scrollY < elementTop + elementHeight) {
                const relativeScroll = scrollY - elementTop;
                if (element) {
                    element.style.transform = `translate3d(0, ${relativeScroll * speed}px, 0)`;
                }
            }
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                rafRef.current = window.requestAnimationFrame(update);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', onScroll, { passive: true });
        // Initial update
        rafRef.current = window.requestAnimationFrame(update);

        return () => {
            window.removeEventListener('scroll', onScroll);
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [speed, enabled]);
    
    return ref;
};
