import React, { useState, useEffect, useRef } from "react";
import { ListingPlaceholder } from "../ui/ListingPlaceholder";

interface CardImageCarouselProps {
  images: string | string[];
  alt?: string;
  className?: string;
  featured?: boolean;
}

export function CardImageCarousel({ images, alt = "Card Image", className = "", featured = false }: CardImageCarouselProps) {
  const imageUrls = typeof images === 'string' 
    ? images.split(',').filter(url => !!url.trim()) 
    : images;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hasError, setHasError] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isHovered && imageUrls.length > 1 && !hasError) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % imageUrls.length);
      }, 1500); // Cycle every 1.5s on hover
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setActiveIndex(0); // Reset to first image when not hovered
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, imageUrls.length, hasError]);

  if (!imageUrls || imageUrls.length === 0 || hasError) {
    return <ListingPlaceholder className={className} />;
  }

  return (
    <div 
      className={`relative w-full h-full overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {imageUrls.map((url, idx) => (
          <div key={idx} className="min-w-full h-full flex-shrink-0">
            <img 
              src={url} 
              alt={`${alt} ${idx + 1}`} 
              className="w-full h-full object-cover transition-transform duration-1000"
              style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
              onError={() => setHasError(true)}
            />
          </div>
        ))}
      </div>

      {/* Progress indicators at bottom */}
      {imageUrls.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
          {imageUrls.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all duration-300 ${
                activeIndex === idx ? "w-4 bg-white shadow-sm" : "w-1 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}

      {/* Subtle overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    </div>
  );
}
