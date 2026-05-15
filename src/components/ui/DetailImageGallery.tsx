import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ListingImage } from "@/types/api";

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

  if (!imageUrls || imageUrls.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-charcoal-20 bg-cream-dark">
        <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      </div>
    );
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
