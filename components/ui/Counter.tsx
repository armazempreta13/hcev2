import React, { useState, useEffect, useRef } from 'react';

interface CounterProps {
    end: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
    className?: string;
}

const Counter: React.FC<CounterProps> = ({ end, duration = 2000, prefix = '', suffix = '', className }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const hasAnimated = useRef(false);

    // Easing function for a smoother animation
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    const startTime = performance.now();
                    
                    const animate = (currentTime: number) => {
                        const elapsedTime = currentTime - startTime;
                        const progress = Math.min(elapsedTime / duration, 1);
                        const easedProgress = easeOutCubic(progress);
                        const currentVal = Math.floor(easedProgress * end);
                        
                        setCount(currentVal);
                        
                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            // Ensure it ends on the exact number
                            setCount(end);
                        }
                    };
                    
                    requestAnimationFrame(animate);
                    // Disconnect the observer after animation to prevent re-triggering
                    observer.disconnect();
                }
            },
            {
                threshold: 0.1, // Start animation when 10% of the element is visible
            }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [end, duration]);

    return (
        <div ref={ref} className={className}>
            {prefix}{count}{suffix}
        </div>
    );
};

export default Counter;
