import React from "react";

interface PrelovedCardProps {
  id: number;
  name: string;
  price: number;
  seller: string;
  condition: string;
  imageUrl?: string;
  onClick?: () => void;
}

export function PrelovedCard({ name, price, seller, condition, imageUrl, onClick }: PrelovedCardProps) {
  const formattedPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);

  return (
    <div 
      onClick={onClick}
      className="preloved-card-web bg-elevated rounded-xl shadow-sm border border-subtle overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1"
    >
      <div className="pcard-img w-full aspect-square flex items-center justify-center relative bg-cream-dark overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-[48px]">🛍️</span>
        )}
        <button className="pcard-fav absolute top-3 right-3 w-8 h-8 bg-white/85 backdrop-blur-sm rounded-full flex items-center justify-center text-[14px] cursor-pointer border-none transition-transform hover:scale-110">
          ♡
        </button>
        <div className="pcard-condition absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full py-1 px-3 text-[10px] font-bold tracking-wide uppercase text-charcoal">
          {condition}
        </div>
      </div>
      
      <div className="pcard-info p-4">
        <h3 className="pcard-name font-display text-[14px] font-medium text-charcoal mb-1 leading-snug line-clamp-2">
          {name}
        </h3>
        <div className="pcard-meta-row flex justify-between items-center mt-2">
          <div className="pcard-price text-[16px] font-bold text-terracotta">
            {formattedPrice}
          </div>
          <div className="pcard-seller text-[11px] text-charcoal-60">
            {seller}
          </div>
        </div>
      </div>
    </div>
  );
}
