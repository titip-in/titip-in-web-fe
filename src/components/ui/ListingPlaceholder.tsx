import React from "react";
import { Package } from "lucide-react";

interface ListingPlaceholderProps {
  className?: string;
  iconSize?: number;
}

export function ListingPlaceholder({ className = "w-full h-full", iconSize = 32 }: ListingPlaceholderProps) {
  return (
    <div className={`bg-gradient-to-br from-cream-dark to-cream flex flex-col items-center justify-center text-charcoal-30 gap-2 border-b border-subtle/30 ${className}`}>
      <div className="p-4 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-inner">
        <Package size={iconSize} strokeWidth={1.2} className="opacity-60" />
      </div>
      <span className="text-[9px] font-bold tracking-[2.5px] uppercase opacity-30 mt-1">Titip.in Gallery</span>
    </div>
  );
}
