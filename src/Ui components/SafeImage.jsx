import React, { useState } from 'react';

const SafeImage = ({ src, alt, className, title, fallbackText, ...props }) => {
  const [error, setError] = useState(false);

  const handleImageError = () => {
    setError(true);
  };

  if (error || !src) {
    return (
      <div 
        className={`bg-slate-200 border border-slate-300 flex flex-col items-center justify-center overflow-hidden relative group ${className}`}
        aria-label={alt || 'Image fallback'}
      >
        {/* Subtle background pattern or gradient for a premium feel */}
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-slate-400 to-slate-600"></div>
        
        <div className="relative z-10 flex flex-col items-center p-4 text-center">
          <svg 
            className="w-1/3 h-auto max-w-[48px] text-slate-400 mb-2 opacity-50" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider line-clamp-2">
            {title || fallbackText || alt || 'Preview'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} transition-opacity duration-300`}
      onError={handleImageError}
      {...props}
    />
  );
};

export default SafeImage;
