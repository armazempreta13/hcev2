import React, { useEffect, useRef, useCallback } from 'react';

export const useScrollReveal = () => {
    const observerRef = useRef<IntersectionObserver | null>(null);

    // Clean up the observer on unmount
    useEffect(() => {
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    const callbackRef = useCallback((node: HTMLElement | null) => {
        if (!node) {
            return; // Don't do anything if the node is not attached
        }

        // Create the observer instance if it doesn't exist
        if (!observerRef.current) {
            observerRef.current = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const target = entry.target as HTMLElement;
                            target.classList.add('is-revealed');

                            // Find any kinetic text children and apply staggered delays
                            const kineticText = target.querySelector('.kinetic-text-reveal');
                            if (kineticText) {
                                kineticText.querySelectorAll('span > span').forEach((span, index) => {
                                    (span as HTMLElement).style.transitionDelay = `${index * 0.05}s`;
                                });
                            }
                            
                            observer.unobserve(target);
                        }
                    });
                },
                {
                    rootMargin: "0px 0px 250px 0px",
                    threshold: 0.01
                }
            );
        }

        // Start observing the node
        observerRef.current.observe(node);
    }, []); // The callback is stable and won't change across renders

    return callbackRef;
};


export const KineticText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
    return (
        <span className={`kinetic-text-reveal ${className || ''}`}>
            {text.split(' ').map((word, index) => (
                <span key={index}>
                    <span>{word}&nbsp;</span>
                </span>
            ))}
        </span>
    );
};
