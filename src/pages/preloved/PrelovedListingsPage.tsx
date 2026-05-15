import React, { useState } from "react";
import { usePrelovedListings } from "@/hooks/usePreloved";
import { PrelovedCard } from "@/components/home/PrelovedCard";
import { CategoryScroll } from "@/components/ui/CategoryScroll";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export default function PrelovedListingsPage() {
  const { data: listings, isLoading } = usePrelovedListings();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

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
          <h1 className="font-display text-[28px] font-medium text-charcoal leading-tight">Preloved Marketplace</h1>
          <p className="text-[14px] text-charcoal-60 mt-1">Barang preloved dari mahasiswa Malang — beli dengan harga terjangkau</p>
        </div>
        <button 
          onClick={() => navigate('/preloved/listings/create')}
          className="btn btn-md btn-terra bg-terracotta text-white rounded-full font-body font-semibold px-6 py-3 text-[14px] hover:bg-terracotta-dark shadow-sm transition-all active:scale-[0.97] flex items-center gap-2"
        >
          🛍️ Jual Barang
        </button>
      </div>

      <CategoryScroll 
        type="preloved" 
        selectedId={selectedCategoryId} 
        onSelect={setSelectedCategoryId} 
      />

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 stagger-children">
        {isLoading ? (
          <div className="col-span-full py-20 text-center text-charcoal-60 flex flex-col items-center">
            <svg className="animate-spin h-8 w-8 mb-4 text-terracotta" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Memuat preloved...
          </div>
        ) : filteredListings.length > 0 ? (
          filteredListings.map((listing, idx) => (
            <PrelovedCard 
              key={listing.id}
              featured={idx < 2}
              user={{ name: listing.user?.name || "User", avatarClass: "bg-gradient-to-br from-terracotta to-terracotta-dark", avatarInitial: (listing.user?.name || "U").charAt(0).toUpperCase(), wa_number: listing.user?.wa_number }}
              timeAgo={new Date(listing.created_at || '').toLocaleDateString('id-ID')}
              status={listing.status}
              title={listing.title}
              price={listing.price}
              condition={listing.condition}
              category={listing.category ? `${listing.category.icon || ''} ${listing.category.name}`.trim() : undefined}
              imageUrl={listing.primary_image_url}
              images={listing.images}
              actionText="Cek Detail"
              isOwner={listing.user_id === user?.id}
              onClick={() => navigate(`/preloved/listings/${listing.id}`)}
              onWhatsApp={(wa) => window.open(`https://wa.me/${wa}`, '_blank')}
            />
          ))
        ) : (
          <div className="col-span-full py-16 text-center border-2 border-dashed border-subtle rounded-2xl text-charcoal-60 bg-elevated">
            <div className="text-4xl mb-3">🛍️</div>
            <h3 className="text-lg font-semibold text-charcoal mb-1">Belum ada Barang</h3>
            <p>Jadilah yang pertama menjual barang preloved!</p>
          </div>
        )}
      </div>
    </div>
  );
}
