import React, { useState, useRef, useEffect, useCallback } from 'react';

interface BeforeAfterSliderProps {
  originalSrc: string;
  enhancedSrc: string;
}

export default function BeforeAfterSlider({ originalSrc, enhancedSrc }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  }, [isDragging]);

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    // Needed to handle global mouseup/touchend if user drags outside
    const handleGlobalMouseMove = (e: globalThis.MouseEvent) => handleMove(e.clientX);
    const handleGlobalTouchMove = (e: globalThis.TouchEvent) => handleMove(e.touches[0].clientX);

    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleMouseUp);
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('touchmove', handleGlobalTouchMove);
    }
    
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('touchmove', handleGlobalTouchMove);
    };
  }, [isDragging, handleMove]);

  const handleMouseDown = () => setIsDragging(true);
  const handleTouchStart = () => setIsDragging(true);

  return (
    <div 
      className="relative w-full max-w-4xl mx-auto overflow-hidden select-none touch-none aspect-[3/4] sm:aspect-[4/5] md:aspect-auto md:h-[70vh] bg-surface rounded-sm border border-border"
      ref={containerRef}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={originalSrc} 
        alt="Original" 
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
      />
      
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={enhancedSrc} 
          alt="Enhanced" 
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />
      </div>

      <div 
        className="absolute top-0 bottom-0 w-[2px] bg-accent cursor-ew-resize flex items-center justify-center transform -translate-x-1/2 z-10"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="w-10 h-10 bg-background border-2 border-accent rounded-full flex items-center justify-center shadow-lg cursor-ew-resize shrink-0">
          <div className="flex gap-[2px]">
            <div className="w-0.5 h-3 bg-accent/80 rounded-full" />
            <div className="w-0.5 h-3 bg-accent/80 rounded-full" />
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-md text-primaryText text-xs sm:text-sm px-3 py-1.5 rounded-sm border border-border/50 font-medium tracking-wide shadow-black/50 shadow-md">
        Original
      </div>
      <div className="absolute bottom-4 right-4 bg-accent text-background text-xs sm:text-sm px-3 py-1.5 rounded-sm font-medium tracking-wide shadow-black/50 shadow-md">
        Enhanced — Sony A1 Edit
      </div>
    </div>
  );
}
