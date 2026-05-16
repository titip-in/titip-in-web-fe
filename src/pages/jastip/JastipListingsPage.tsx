import React, { useState } from "react";
import { useJastipListings } from "@/hooks/useJastip";
import { JastipCard } from "@/components/home/JastipCard";
import { CategoryScroll } from "@/components/ui/CategoryScroll";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useCategories } from "@/hooks/useCategory";
import { useActiveItemCount } from "@/hooks/useActiveItemCount";
import {
  AlertDialog, AlertDialogAction, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function JastipListingsPage() {
  const { data: listings, isLoading } = useJastipListings();
  const { data: categories } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { isJastipListingLimitReached, jastipListingActiveCount, ACTIVE_LIMIT } = useActiveItemCount();
  const [limitDialogOpen, setLimitDialogOpen] = useState(false);

  const handleCreateClick = () => {
    if (isJastipListingLimitReached) { setLimitDialogOpen(true); return; }
    navigate('/jastip/listings/create');
  };

  const getCategoryTag = (item: any) => {
    if (item.category) {
      return `${item.category.icon || ''} ${item.category.name}`.trim();
    }
    if (item.category_id && categories) {
      const cat = categories.find(c => c.id === item.category_id);
      if (cat) return `${cat.icon || ''} ${cat.name}`.trim();
    }
    return "Umum";
  };

  const filteredListings = React.useMemo(() => {
    if (!listings) return [];
    if (selectedCategoryId === null) return listings;
    return listings.filter(l => l.category_id === selectedCategoryId);
  }, [listings, selectedCategoryId]);

  return (
    <div className="w-full animate-fade-in">
      {/* Header */}
      <div className="section-header flex justify-between items-center mb-6">
        <div>
          <h1 className="font-display text-[28px] font-medium text-charcoal leading-tight">Jastip Tersedia</h1>
          <p className="text-[14px] text-charcoal-60 mt-1">Jastip aktif di sekitar Malang — hubungi langsung via WhatsApp</p>
        </div>
        <button 
          onClick={handleCreateClick}
          className="btn btn-md btn-terra bg-terracotta text-white rounded-full font-body font-semibold px-6 py-3 text-[14px] hover:bg-terracotta-dark shadow-sm transition-all active:scale-[0.97] flex items-center gap-2"
        >
          📦 Buka Jastip
        </button>
      </div>

      <CategoryScroll 
        type="jastip" 
        selectedId={selectedCategoryId} 
        onSelect={setSelectedCategoryId} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
        {isLoading ? (
          <div className="col-span-full py-20 text-center text-charcoal-60 flex flex-col items-center">
            <svg className="animate-spin h-8 w-8 mb-4 text-sage" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Memuat jastip...
          </div>
        ) : filteredListings.length > 0 ? (
          filteredListings.map((listing) => (
            <JastipCard 
              key={listing.id}
              user={{ 
                name: listing.user?.name || "User", 
                avatarClass: "bg-gradient-to-br from-sage to-sage-dark", 
                avatarInitial: (listing.user?.name || "U").charAt(0).toUpperCase(), 
                avatar_url: listing.user?.avatar_url,
                wa_number: listing.user?.wa_number 
              }}
              timeAgo={new Date(listing.created_at || '').toLocaleDateString('id-ID')}
              status={listing.status}
              title={listing.title}
              route={{ from: listing.from_loc, to: listing.to_loc }}
              tags={[getCategoryTag(listing)]}
              deadline={new Date(listing.deadline).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
              imageUrl={listing.primary_image_url}
              images={listing.images}
              actionText="Lihat Detail"
              isOwner={listing.user_id === user?.id}
              onClick={() => navigate(`/jastip/listings/${listing.id}`)}
              onWhatsApp={(wa) => window.open(`https://wa.me/${wa}`, '_blank')}
            />
          ))
        ) : (
          <div className="col-span-full py-16 text-center border-2 border-dashed border-subtle rounded-2xl text-charcoal-60 bg-elevated">
            <div className="text-4xl mb-3">📦</div>
            <h3 className="text-lg font-semibold text-charcoal mb-1">Belum ada Jastip</h3>
            <p>Jadilah yang pertama membuka jastip!</p>
          </div>
        )}
      </div>

      <AlertDialog open={limitDialogOpen} onOpenChange={setLimitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="text-4xl mb-2 text-center">🚫</div>
            <AlertDialogTitle className="text-center">Batas Aktif Tercapai</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Kamu sudah memiliki <strong>{jastipListingActiveCount}/{ACTIVE_LIMIT}</strong> jastip listing aktif.<br/><br/>
              Tutup atau hapus salah satu listing sebelum membuat yang baru.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setLimitDialogOpen(false)} className="bg-charcoal hover:bg-charcoal-80 text-white w-full">Oke, Mengerti</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
