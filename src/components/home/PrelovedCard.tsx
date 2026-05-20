import React from "react";
import { CardImageCarousel } from "./CardImageCarousel";
import { ListingImage, UserTier } from "@/types/api";
import { Check, RotateCcw, Trash2, ArrowRight, Zap, Flame } from "lucide-react";
import { ListingPlaceholder } from "../ui/ListingPlaceholder";
import { TierBadge } from "../ui/TierBadge";

interface PrelovedCardProps {
  user: {
    name: string;
    avatarClass: string;
    avatarInitial: string;
    avatar_url?: string | null;
    wa_number?: string | null;
  };
  timeAgo: string;
  status: "AVAILABLE" | "SOLD" | "RESERVED" | "OPEN" | "FOUND" | "CLOSED";
  title: string;
  price?: number;
  maxPrice?: number | null;
  condition?: "NEW" | "LIKE_NEW" | "GOOD" | "FAIR";
  category?: string;
  imageUrl?: string | null;
  images?: ListingImage[];
  description?: string | null;
  actionText: string;
  featured?: boolean;
  onClick?: () => void;
  onWhatsApp?: (wa: string) => void;
  // CRUD props for Mine pages
  onStatusChange?: (newStatus: string) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onBoost?: () => void;
  isOwner?: boolean;
  hideImage?: boolean;
  userTier?: UserTier;
  boostedAt?: string | null;
  boostQuota?: number;
}

export function PrelovedCard({ 
  user, timeAgo, status, title, price, maxPrice, condition, category, imageUrl, images, description, actionText, featured, onClick, onWhatsApp, onStatusChange, onEdit, onDelete, onBoost, isOwner, hideImage, userTier, boostedAt, boostQuota
}: PrelovedCardProps) {
  
  const isAvailable = status === "AVAILABLE" || status === "OPEN";

  // Extract all image URLs
  const imageUrls = React.useMemo(() => {
    if (images && images.length > 0) {
      return images.map(img => img.image_url);
    }
    if (imageUrl) return [imageUrl];
    return [];
  }, [images, imageUrl]);

  const conditionMap: Record<string, string> = {
    NEW: "Baru",
    LIKE_NEW: "Seperti Baru",
    GOOD: "Bagus",
    FAIR: "Cukup",
  };

  const conditionColorMap: Record<string, string> = {
    NEW: "bg-sage-pale text-sage-dark",
    LIKE_NEW: "bg-sage-pale text-sage-dark",
    GOOD: "bg-gold-pale text-gold-dark",
    FAIR: "bg-cream-dark text-charcoal-60",
  };

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <div 
      onClick={onClick}
      className={`pcard bg-elevated rounded-xl shadow-sm border border-subtle overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-[3px] flex flex-col h-full ${featured ? 'lg:col-span-3 col-span-full' : 'lg:col-span-2 col-span-1'}`}
    >
      {/* Image area */}
      {!hideImage && (
        <div className={`w-full relative bg-cream-dark shrink-0 overflow-hidden ${featured ? 'h-48' : 'h-40'}`}>
          {imageUrls.length > 0 ? (
            <CardImageCarousel 
              images={imageUrls} 
              alt={title} 
              featured={featured}
            />
          ) : (
            <ListingPlaceholder />
          )}
          {/* Status badge on image */}
          <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
            <div className={`status-pill inline-flex items-center gap-1 py-1 px-3 rounded-full text-[10px] font-bold tracking-wide uppercase shadow-sm ${isAvailable ? 'bg-sage text-white' : status === 'SOLD' || status === 'FOUND' ? 'bg-charcoal text-white' : status === 'RESERVED' ? 'bg-gold text-white' : 'bg-charcoal-30 text-white'}`}>
              {status === 'AVAILABLE' ? 'Tersedia' : status === 'SOLD' ? 'Terjual' : status === 'RESERVED' ? 'Dipesan' : status === 'OPEN' ? 'Terbuka' : status === 'FOUND' ? 'Ditemukan' : status === 'CLOSED' ? 'Ditutup' : status}
            </div>
            {isOwner && (
               <span className="bg-charcoal text-cream px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-sm">
                Milik Saya
              </span>
            )}
          </div>
          {/* Condition badge on image */}
          {condition && (
            <span className={`absolute bottom-3 left-3 rounded-full py-[3px] px-[10px] text-[9px] font-bold tracking-[0.5px] uppercase shadow-sm ${conditionColorMap[condition] || 'bg-cream-dark text-charcoal-60'}`}>
              {conditionMap[condition] || condition}
            </span>
          )}
          {category && (
            <span className="absolute bottom-3 right-3 rounded-full py-[3px] px-[10px] text-[9px] font-bold tracking-[0.5px] uppercase shadow-sm bg-white/90 backdrop-blur-sm text-charcoal-60">
              {category}
            </span>
          )}
          {boostedAt && (
            <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
              <Flame size={12} fill="currentColor" />
              Dipromosikan
            </div>
          )}
        </div>
      )}

      <div className="p-4 flex flex-col flex-grow">
        {hideImage && (
          <div className="flex justify-between items-start mb-4 pb-3 border-b border-subtle">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-[12px] font-bold text-white shrink-0 ${user.avatarClass} border border-subtle`}>
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.avatarInitial
                )}
              </div>
              <div>
                <div className="text-[13px] font-semibold text-charcoal flex items-center gap-1.5">
                  {user.name}
                  {userTier && <TierBadge tier={userTier} size="xs" />}
                </div>
                <div className="text-[10px] text-charcoal-60 mt-[1px]">Dibuat {timeAgo}</div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <div className={`inline-flex items-center gap-1 py-0.5 px-2.5 rounded-full text-[9px] font-bold tracking-wide uppercase ${isAvailable ? 'bg-terracotta-pale text-terracotta-dark' : status === 'SOLD' || status === 'FOUND' ? 'bg-charcoal text-white' : 'bg-gold-pale text-gold-dark'}`}>
                <div className="w-[4px] h-[4px] rounded-full bg-current"></div>
                {status === 'AVAILABLE' ? 'Tersedia' : status === 'OPEN' ? 'Terbuka' : status === 'SOLD' ? 'Terjual' : status === 'FOUND' ? 'Ditemukan' : status === 'CLOSED' ? 'Ditutup' : status}
              </div>
              {isOwner && (
                <span className="bg-charcoal text-cream px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                  Milik Saya
                </span>
              )}
              {boostedAt && (
                <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm shrink-0">
                  <Flame size={10} fill="currentColor" />
                  Dipromosikan
                </span>
              )}
              {category && (
                <div className="text-[10px] font-medium text-charcoal-60 px-2 py-0.5 bg-cream-dark rounded-full">
                  {category}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Title */}
        <h3 className="font-display text-[15px] font-medium text-charcoal mb-1.5 leading-[1.3] line-clamp-2">{title}</h3>
        
        {description && (
          <p className="text-[12px] text-charcoal-60 mb-2 line-clamp-2">{description}</p>
        )}

        {/* Price + Seller row */}
        <div className="mt-auto pt-2">
          <div className="flex justify-between items-center">
            <span className="text-[16px] font-bold text-terracotta">
              {price !== undefined ? formatRupiah(price) : maxPrice ? `Max ${formatRupiah(maxPrice)}` : 'Harga Nego'}
            </span>
            {!hideImage && (
              <span className="text-[11px] text-charcoal-60 truncate ml-2">{user.name}</span>
            )}
          </div>
        </div>

        {/* Owner CRUD actions */}
        {isOwner && (onStatusChange || onDelete || onBoost) && (
          <div className="mt-3 pt-3 border-t border-subtle flex gap-2">
            {isAvailable && onBoost && (
              <button
                onClick={(e) => { e.stopPropagation(); onBoost(); }}
                title="Boost Listing"
                className="py-2 px-3 rounded-full text-[11px] font-semibold transition-colors flex items-center justify-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-sm hover:opacity-90"
              >
                <Zap size={14} fill="currentColor" />
                <span className="hidden sm:inline">Boost</span>
              </button>
            )}
            {onStatusChange && (
              <button
                onClick={(e) => { 
                  e.stopPropagation(); 
                  const targetStatus = isAvailable 
                    ? (status === 'OPEN' ? 'FOUND' : 'SOLD') 
                    : (status === 'FOUND' ? 'OPEN' : 'AVAILABLE');
                  onStatusChange(targetStatus); 
                }}
                className={`flex-1 py-2 px-3 rounded-full text-[11px] font-semibold transition-colors ${
                  isAvailable 
                    ? 'bg-charcoal text-cream hover:bg-charcoal-80' 
                    : 'bg-sage text-white hover:bg-sage-dark'
                }`}
              >
                {isAvailable ? (
                  <span className="flex items-center justify-center gap-1.5"><Check size={14} /> Tandai {status === 'OPEN' ? 'Ditemukan' : 'Terjual'}</span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5"><RotateCcw size={14} /> Buka Lagi</span>
                )}
              </button>
            )}
            {onEdit && (
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className="py-2 px-3 rounded-full text-[11px] font-semibold bg-cream-dark text-charcoal hover:bg-charcoal-10 transition-colors"
                title="Edit"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="py-2 px-3 rounded-full text-[11px] font-semibold bg-red-pale text-red hover:bg-red/10 transition-colors"
                title="Hapus"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        )}

        {/* Non-owner actions */}
        {!isOwner && (
          <div className="mt-3 pt-3 border-t border-subtle flex justify-between items-center gap-2">
            {user.wa_number && onWhatsApp && (
              <button 
                onClick={(e) => { e.stopPropagation(); onWhatsApp(user.wa_number!); }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors shrink-0"
                title="Chat via WhatsApp"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              </button>
            )}
            <button className="btn btn-sm rounded-full text-[12px] font-semibold border-[1.5px] border-charcoal-30 text-charcoal py-1.5 px-4 hover:border-charcoal hover:bg-charcoal-10 transition-colors flex items-center gap-1.5">
              {actionText} <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
