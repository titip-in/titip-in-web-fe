import React from "react";
import { CardImageCarousel } from "./CardImageCarousel";
import { ListingImage } from "@/types/api";
import { Pause, Play, Trash2, ArrowRight } from "lucide-react";
import { ListingPlaceholder } from "../ui/ListingPlaceholder";

interface JastipCardProps {
  user: {
    name: string;
    avatarClass: string;
    avatarInitial: string;
    avatar_url?: string | null;
    wa_number?: string | null;
  };
  timeAgo: string;
  status: "ACTIVE" | "CLOSED" | "OPEN" | "TAKEN" | "Aktif" | "Pending";
  route: {
    from: string;
    to: string;
  };
  title?: string;
  tags: string[];
  deadline?: string;
  notes?: string;
  actionText: string;
  onClick?: () => void;
  onWhatsApp?: (wa: string) => void;
  imageUrl?: string | null;
  images?: ListingImage[];
  // CRUD props for Mine pages
  onStatusChange?: (newStatus: string) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isOwner?: boolean;
  hideImage?: boolean;
}

export function JastipCard({ 
  user, timeAgo, status, route, title, tags, deadline, notes, actionText, onClick, onWhatsApp, imageUrl, images, onStatusChange, onEdit, onDelete, isOwner, hideImage 
}: JastipCardProps) {
  const isAvailable = status === "ACTIVE" || status === "Aktif" || status === "OPEN";

  // Extract all image URLs
  const imageUrls = React.useMemo(() => {
    if (images && images.length > 0) {
      return images.map(img => img.image_url);
    }
    if (imageUrl) return [imageUrl];
    return [];
  }, [images, imageUrl]);

  return (
    <div 
      onClick={onClick}
      className="jcard bg-elevated rounded-xl shadow-sm border border-subtle overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 flex flex-col h-full"
    >
      {!hideImage && (
        <>
          {imageUrls.length > 0 ? (
            <div className="w-full h-36 bg-cream-dark relative shrink-0 overflow-hidden">
              <CardImageCarousel 
                images={imageUrls} 
                alt="Tiket Jastip" 
              />
            </div>
          ) : (
            <div className="w-full h-36 shrink-0">
              <ListingPlaceholder />
            </div>
          )}
        </>
      )}

      <div className="p-5 flex flex-col flex-grow">
        <div className="jcard-top flex justify-between items-start mb-3">
          <div className="jcard-user flex items-center gap-3">
            <div className={`jcard-avatar w-10 h-10 rounded-full overflow-hidden flex items-center justify-center text-[14px] font-bold text-white shrink-0 ${user.avatarClass} border border-subtle`}>
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.avatarInitial
              )}
            </div>
            <div>
              <div className="jcard-name text-[14px] font-semibold text-charcoal">{user.name}</div>
              <div className="jcard-meta text-[11px] text-charcoal-60 mt-[1px]">Dibuat {timeAgo}</div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className={`status-pill inline-flex items-center gap-1 py-1 px-3 rounded-full text-[10px] font-bold tracking-wide uppercase ${isAvailable ? 'bg-sage-pale text-sage-dark' : status === 'TAKEN' ? 'bg-gold-pale text-gold-dark' : 'bg-charcoal-10 text-charcoal-60'}`}>
              <div className="w-[5px] h-[5px] rounded-full bg-current"></div>
              {status === 'ACTIVE' || status === 'Aktif' ? 'Aktif' : status === 'OPEN' ? 'Terbuka' : status === 'CLOSED' ? 'Ditutup' : status === 'TAKEN' ? 'Diambil' : status}
            </div>
            {isOwner && (
              <span className="bg-charcoal text-cream px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                Milik Saya
              </span>
            )}
          </div>
        </div>

        {title && (
          <h3 className="font-display text-[18px] font-medium text-charcoal mb-1.5 line-clamp-1">{title}</h3>
        )}

        <div className="jcard-route flex items-center gap-2 mb-3">
          <span className="jcard-place text-[16px] font-bold text-charcoal">{route.from}</span>
          <svg className="jcard-arrow text-charcoal-30 w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
          </svg>
          <span className="jcard-place text-[16px] font-bold text-charcoal">{route.to}</span>
        </div>

        <div className="jcard-tags flex gap-2 flex-wrap mb-4">
          {tags.map((tag, idx) => (
            <span key={idx} className="tag-pill bg-cream-dark rounded-full py-1 px-3 text-[11px] text-charcoal-60 font-medium flex items-center gap-1">
              {tag}
            </span>
          ))}
        </div>

        {notes && (
          <p className="text-[13px] text-charcoal-60 mb-4 line-clamp-2 italic">"{notes}"</p>
        )}

        <div className="jcard-footer mt-auto pt-3 border-t border-subtle flex justify-between items-center gap-2">
          {deadline && (
            <div className="jcard-deadline text-[12px] text-charcoal-60 font-medium">
              Batas Nitip: <br/><span className="text-charcoal font-semibold">{deadline}</span>
            </div>
          )}
          
          <div className="flex gap-2 ml-auto">
            {/* Owner CRUD actions */}
            {isOwner && onStatusChange && (
              <button
                onClick={(e) => { e.stopPropagation(); onStatusChange(isAvailable ? 'CLOSED' : 'ACTIVE'); }}
                className={`btn btn-sm rounded-full text-[11px] font-semibold py-2 px-4 transition-colors ${
                  isAvailable
                    ? 'bg-charcoal text-cream hover:bg-charcoal-80'
                    : 'bg-sage text-white hover:bg-sage-dark'
                }`}
              >
                {isAvailable ? (
                  <span className="flex items-center gap-1.5"><Pause size={12} fill="currentColor" /> Tutup</span>
                ) : (
                  <span className="flex items-center gap-1.5"><Play size={12} fill="currentColor" /> Buka Lagi</span>
                )}
              </button>
            )}
            {isOwner && onEdit && (
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className="btn btn-sm rounded-full text-[11px] font-semibold py-2 px-3 bg-cream-dark text-charcoal hover:bg-charcoal-10 transition-colors"
                title="Edit"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              </button>
            )}
            {isOwner && onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="btn btn-sm rounded-full text-[11px] font-semibold py-2 px-3 bg-red-pale text-red hover:bg-red/10 transition-colors"
                title="Hapus"
              >
                <Trash2 size={14} />
              </button>
            )}
            
            {/* Non-owner actions */}
            {!isOwner && (
              <>
                {user.wa_number && onWhatsApp && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onWhatsApp(user.wa_number!); }}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                    title="Chat via WhatsApp"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                  </button>
                )}
                <button className="btn btn-sm rounded-full text-[12px] font-semibold border-[1.5px] border-charcoal-30 text-charcoal py-2 px-4 hover:border-charcoal hover:bg-charcoal-10 transition-colors flex items-center gap-1.5">
                  {actionText} <ArrowRight size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
