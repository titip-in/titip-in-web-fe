import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSearch } from "@/hooks/useSearch";
import { PrelovedCard } from "@/components/home/PrelovedCard";
import { JastipCard } from "@/components/home/JastipCard";
import { CategoryScroll } from "@/components/ui/CategoryScroll";
import { useAuthStore } from "@/stores/authStore";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const q = searchParams.get('q') || '';
  const typeParam = searchParams.get('type') as 'jastip' | 'preloved' || 'jastip';
  const [activeType, setActiveType] = useState<'jastip' | 'preloved'>(typeParam);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const { data: results, isLoading, error } = useSearch(q, activeType);

  const filteredResults = React.useMemo(() => {
    if (!results) return [];
    
    // 1. Filter by requested type (just in case backend returns mixed)
    const typeFiltered = results.filter((item: any) => {
      const isPreloved = 'price' in item || 'condition' in item;
      return activeType === 'preloved' ? isPreloved : !isPreloved;
    });

    // 2. Filter by selected category
    if (selectedCategoryId === null) return typeFiltered;
    return typeFiltered.filter((item: any) => item.category_id === selectedCategoryId);
  }, [results, activeType, selectedCategoryId]);

  useEffect(() => {
    setActiveType(typeParam);
  }, [typeParam]);


  const switchType = (t: 'jastip' | 'preloved') => {
    setActiveType(t);
    setSelectedCategoryId(null); // Reset category when switching type
    navigate(`/search?q=${encodeURIComponent(q)}&type=${t}`, { replace: true });
  };

  return (
    <div className="max-w-[1100px] mx-auto py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-baseline gap-2 mb-1">
          <h1 className="font-display text-[32px] font-medium text-charcoal leading-tight">Hasil Pencarian</h1>
        </div>
        <p className="text-[15px] text-charcoal-60">
          {q ? (
            <>Menampilkan hasil untuk "<span className="font-semibold text-charcoal">{q}</span>"</>
          ) : (
            "Masukkan kata kunci di kolom pencarian di atas."
          )}
        </p>
      </div>

      {/* Type Tabs */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => switchType('jastip')}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
            activeType === 'jastip'
              ? 'bg-charcoal text-cream shadow-sm'
              : 'bg-cream-dark text-charcoal-60 hover:bg-cream-hover hover:text-charcoal'
          }`}
        >
          🧳 Jastip
        </button>
        <button
          onClick={() => switchType('preloved')}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
            activeType === 'preloved'
              ? 'bg-charcoal text-cream shadow-sm'
              : 'bg-cream-dark text-charcoal-60 hover:bg-cream-hover hover:text-charcoal'
          }`}
        >
          🛍️ Preloved
        </button>
      </div>

      {q && !isLoading && (
        <CategoryScroll 
          selectedId={selectedCategoryId} 
          onSelect={setSelectedCategoryId} 
        />
      )}

      {/* Results Grid */}
      {!q ? (
        <div className="py-20 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-medium text-charcoal mb-2">Mulai Pencarian</h3>
          <p className="text-charcoal-60 max-w-md mx-auto">Ketik kata kunci di kolom pencarian untuk menemukan jastip atau barang preloved.</p>
        </div>
      ) : isLoading ? (
        <div className="py-20 text-center text-charcoal-60 flex flex-col items-center">
          <svg className="animate-spin h-8 w-8 mb-4 text-sage" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Mencari dengan AI...
        </div>
      ) : error ? (
        <div className="py-20 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-charcoal mb-2">Pencarian Gagal</h3>
          <p className="text-charcoal-60">Coba lagi nanti atau gunakan kata kunci lain.</p>
        </div>
      ) : filteredResults && filteredResults.length > 0 ? (
        <div className={`grid gap-6 ${activeType === 'preloved' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
          {filteredResults.map((item: any) => (
            activeType === 'preloved' ? (
              <PrelovedCard
                key={item.id}
                user={{
                  name: item.user?.name || "User",
                  avatarClass: "bg-gradient-to-br from-terracotta to-terracotta-dark",
                  avatarInitial: (item.user?.name || "U").charAt(0).toUpperCase(),
                  wa_number: item.user?.wa_number,
                }}
                timeAgo={new Date(item.created_at || '').toLocaleDateString('id-ID')}
                status={item.status}
                title={item.title}
                price={item.price}
                condition={item.condition}
                category={item.category ? `${item.category.icon || ''} ${item.category.name}`.trim() : undefined}
                imageUrl={item.primary_image_url || item.image_url || item.thumbnail_url || item.media_url}
                images={item.images || []}
                actionText="Cek Detail"
                isOwner={item.user_id === user?.id}
                onClick={() => navigate(`/preloved/listings/${item.id}`)}
                onWhatsApp={(wa) => window.open(`https://wa.me/${wa}`, '_blank')}
              />
            ) : (
              <JastipCard
                key={item.id}
                user={{
                  name: item.user?.name || "User",
                  avatarClass: "bg-gradient-to-br from-sage to-sage-dark",
                  avatarInitial: (item.user?.name || "U").charAt(0).toUpperCase(),
                  wa_number: item.user?.wa_number,
                }}
                timeAgo={new Date(item.created_at || '').toLocaleDateString('id-ID')}
                status={item.status}
                route={{ from: item.from_loc, to: item.to_loc }}
                tags={[item.category ? `${item.category.icon || ''} ${item.category.name}`.trim() : "Umum"]}
                deadline={item.deadline ? new Date(item.deadline).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : undefined}
                imageUrl={item.primary_image_url || item.image_url || item.thumbnail_url || item.media_url}
                images={item.images || []}
                actionText="Lihat Detail"
                isOwner={item.user_id === user?.id}
                onClick={() => navigate(`/jastip/listings/${item.id}`)}
                onWhatsApp={(wa) => window.open(`https://wa.me/${wa}`, '_blank')}
              />
            )
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <div className="text-5xl mb-4">🤷</div>
          <h3 className="text-lg font-medium text-charcoal mb-2">Tidak Ditemukan</h3>
          <p className="text-charcoal-60 max-w-md mx-auto">Coba kata kunci lain atau periksa kategori pencarian.</p>
        </div>
      )}
    </div>
  );
}
