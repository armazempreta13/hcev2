import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top', className }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [dynamicPosition, setDynamicPosition] = useState(position);
  
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<number | null>(null);
  
  const id = React.useId();

  const handleShow = () => {
    // Check if strictly touch device to prevent hover simulation issues, 
    // though the CSS class 'hidden md:block' handles the visual part mostly.
    if (window.matchMedia('(hover: none)').matches) return;

    if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
    }
    setIsMounted(true);
  };

  const handleHide = () => {
    setIsVisible(false);
    hideTimeoutRef.current = window.setTimeout(() => {
        setIsMounted(false);
    }, 100); // Matches transition duration in CSS
  };

  useEffect(() => {
    if (isMounted) {
        // Use a microtask to ensure the element is rendered before adding the class for transition
        queueMicrotask(() => setIsVisible(true));
    }
  }, [isMounted]);

  useLayoutEffect(() => {
    if (isMounted && isVisible && wrapperRef.current && tooltipRef.current) {
        const wrapperRect = wrapperRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const buffer = 10;

        let newPos = position;

        const overflows = {
            top: wrapperRect.top - tooltipRect.height < buffer,
            bottom: wrapperRect.bottom + tooltipRect.height > viewportHeight - buffer,
            left: wrapperRect.left - tooltipRect.width < buffer,
            right: wrapperRect.right + tooltipRect.width > viewportWidth - buffer,
        };

        if (position === 'top' && overflows.top) newPos = 'bottom';
        if (position === 'bottom' && overflows.bottom) newPos = 'top';
        if (position === 'left' && overflows.left) newPos = 'right';
        if (position === 'right' && overflows.right) newPos = 'left';
        
        setDynamicPosition(newPos);
    }
  }, [isMounted, isVisible, position]);

  const tooltipPositionClasses: { [key: string]: string } = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-3',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-3',
    left: 'right-full top-1/2 -translate-y-1/2 mr-3',
    right: 'left-full top-1/2 -translate-y-1/2 ml-3',
  };

  // FIX: Cast props to 'any' to resolve a TypeScript error with React.cloneElement.
  const childrenWithProps = React.cloneElement(children, {
    'aria-describedby': id,
  } as any);

  return (
    <div
      ref={wrapperRef}
      className={`relative inline-flex ${className || ''}`}
      onMouseEnter={handleShow}
      onMouseLeave={handleHide}
      onFocus={handleShow}
      onBlur={handleHide}
    >
      {childrenWithProps}
      {isMounted && (
        <div
          ref={tooltipRef}
          id={id}
          role="tooltip"
          // Added 'hidden md:block' to ensure tooltips never show on mobile
          className={`tooltip-bubble hidden md:block ${tooltipPositionClasses[dynamicPosition]} ${isVisible ? 'is-visible' : ''}`}
          data-position={dynamicPosition}
        >
          {content}
          <div className="tooltip-arrow" />
        </div>
      )}
    </div>
  );
};