import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ListingImage } from "@/types/api";
import { ListingPlaceholder } from "./ListingPlaceholder";

interface DetailImageGalleryProps {
  images: string | string[] | ListingImage[]; // Comma separated string, array of strings, or array of ListingImage
  alt?: string;
}

export function DetailImageGallery({ images, alt = "Product Image" }: DetailImageGalleryProps) {
  const imageUrls = React.useMemo(() => {
    if (typeof images === 'string') {
      return images.split(',').filter(url => !!url.trim());
    }
    if (Array.isArray(images) && images.length > 0) {
      if (typeof images[0] === 'string') return images as string[];
      return (images as ListingImage[]).map(img => img.image_url);
    }
    return [];
  }, [images]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  if (!imageUrls || imageUrls.length === 0 || hasError) {
    return <ListingPlaceholder iconSize={48} />;
  }

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % imageUrls.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);

  return (
    <div className="relative w-full h-full group bg-cream-dark flex flex-col">
      {/* Main Image */}
      <div className="relative flex-grow overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-out h-full"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {imageUrls.map((url, idx) => (
            <div key={idx} className="min-w-full h-full flex-shrink-0">
              <img 
                src={url} 
                alt={`${alt} ${idx + 1}`} 
                className="w-full h-full object-cover"
                onError={() => setHasError(true)}
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {imageUrls.length > 1 && (
          <>
            <button 
              onClick={(e) => { e.stopPropagation(); prevSlide(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/50"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); nextSlide(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/50"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Indicators */}
        {imageUrls.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {imageUrls.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeIndex === idx ? "w-8 bg-white" : "w-2 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails (for desktop) */}
      {imageUrls.length > 1 && (
        <div className="p-4 bg-white/50 backdrop-blur-sm flex gap-3 overflow-x-auto no-scrollbar border-t border-subtle">
          {imageUrls.map((url, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative flex-shrink-0 w-20 aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                activeIndex === idx ? "border-sage scale-105 shadow-md" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
