import React, { useState } from 'react';

const ImageWithLoader: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({
  className,
  style,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  
  const imageStyle: React.CSSProperties = {
    ...style,
    opacity: isLoading ? 0 : 1,
    // transition: 'opacity 0.4s ease-in-out', // REMOVED FOR INSTANT APPEARANCE
  };

  return (
    // A simple relative wrapper allows us to position the shimmer
    <div className="relative w-full h-full">
      {isLoading && (
        <div
          className={`shimmer-placeholder absolute inset-0 ${className || ''}`}
          // We apply the inline styles to the shimmer as well, so it matches
          style={style}
        />
      )}
      <img
        {...props}
        className={className}
        style={imageStyle}
        loading="eager"
        decoding="async"
        onLoad={(e) => {
          setIsLoading(false);
          onLoad?.(e);
        }}
        onError={(e) => {
          setIsLoading(false); // Stop showing shimmer on error
          onError?.(e);
        }}
      />
    </div>
  );
};

export default ImageWithLoader;
