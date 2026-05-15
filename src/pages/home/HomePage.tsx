import { StatCard } from "@/components/home/StatCard";
import { JastipCard } from "@/components/home/JastipCard";
import { PrelovedCard } from "@/components/home/PrelovedCard";
import { useAuthStore } from "@/stores/authStore";
import { useJastipListings, useJastipRequests } from "@/hooks/useJastip";
import { usePrelovedListings } from "@/hooks/usePreloved";
import { CategoryScroll } from "@/components/ui/CategoryScroll";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

export default function HomePage() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  
  const { data: jastipListings, isLoading: isLoadingJastip } = useJastipListings();
  const { data: jastipRequests } = useJastipRequests();
  const { data: prelovedListings, isLoading: isLoadingPreloved } = usePrelovedListings();

  const [selectedJastipCat, setSelectedJastipCat] = useState<number | null>(null);
  const [selectedPrelovedCat, setSelectedPrelovedCat] = useState<number | null>(null);

  const activeJastip = React.useMemo(() => 
    (jastipListings?.filter(l => l.status === 'ACTIVE' && (selectedJastipCat === null || l.category_id === selectedJastipCat)) || []),
    [jastipListings, selectedJastipCat]
  );
  
  const activePreloved = React.useMemo(() => 
    (prelovedListings?.filter(l => l.status === 'AVAILABLE' && (selectedPrelovedCat === null || l.category_id === selectedPrelovedCat)) || []),
    [prelovedListings, selectedPrelovedCat]
  );
  
  const openRequests = jastipRequests?.filter(r => r.status === 'OPEN') || [];

  return (
    <div className="w-full animate-fade-in space-y-8">
      {/* ── HERO ── */}
      <section className="hero w-full bg-charcoal rounded-2xl p-6 sm:p-8 lg:p-12 relative overflow-hidden min-h-[220px] sm:min-h-[260px] lg:min-h-[280px] flex items-center">
        <div className="hero-blob w-[200px] h-[200px] bg-sage opacity-10 absolute rounded-full -top-[60px] -right-[40px]"></div>
        <div className="hero-blob w-[120px] h-[120px] bg-terracotta opacity-[0.12] absolute rounded-full -bottom-[30px] right-[200px]"></div>
        <div className="hero-blob w-[80px] h-[80px] bg-gold opacity-[0.08] absolute rounded-full top-[20px] right-[160px]"></div>
        
        <div className="hero-content relative z-[1] max-w-[560px]">
          <div className="hero-tag text-[11px] font-semibold tracking-[2px] text-sage uppercase mb-3">● Tersedia Sekarang</div>
          <h1 className="hero-title font-display text-[28px] sm:text-[34px] lg:text-[42px] font-light italic text-cream leading-[1.1] mb-3">
            Jastip & Preloved<br/>di Malang
          </h1>
          <p className="hero-desc text-[13px] sm:text-[14px] lg:text-[15px] text-cream/45 leading-[1.6] mb-4 sm:mb-6 max-w-[440px]">
            Platform hyperlocal untuk mahasiswa Malang. Temukan jastip terdekat dan barang preloved dengan mudah — langsung hubungi via WhatsApp.
          </p>
          <div className="hero-actions flex flex-wrap gap-2 sm:gap-3">
            <button 
              onClick={() => navigate('/jastip/listings/create')}
              className="btn btn-md btn-terra bg-terracotta text-white rounded-full font-body font-semibold px-4 sm:px-6 py-2.5 sm:py-3 text-[13px] sm:text-[14px] hover:bg-terracotta-dark shadow-sm transition-all duration-100 ease-out hover:shadow-md active:scale-[0.97] flex items-center gap-2"
            >
              📦 Buka Jastip
            </button>
            <button 
              onClick={() => navigate('/preloved/listings/create')}
              className="btn btn-md btn-soft bg-cream/10 text-cream border border-cream/12 rounded-full font-body font-semibold px-4 sm:px-6 py-2.5 sm:py-3 text-[13px] sm:text-[14px] hover:bg-cream/15 transition-all duration-100 ease-out active:scale-[0.97] flex items-center gap-2"
            >
              🛍️ Jual Barang
            </button>
          </div>
        </div>

        <div className="hero-stats absolute right-6 lg:right-10 top-1/2 -translate-y-1/2 flex gap-3 lg:gap-4 z-[1] hidden md:flex">
          <div className="hero-stat bg-cream/[0.06] border border-cream/[0.08] rounded-xl p-5 text-center min-w-[120px] backdrop-blur-[8px]">
            <div className="hero-stat-num font-display text-[36px] font-light text-cream leading-[1] mb-1">{activeJastip.length}</div>
            <div className="hero-stat-label text-[10px] text-cream/40 font-medium tracking-[0.5px]">Jastip Aktif</div>
          </div>
          <div className="hero-stat bg-cream/[0.06] border border-cream/[0.08] rounded-xl p-5 text-center min-w-[120px] backdrop-blur-[8px]">
            <div className="hero-stat-num font-display text-[36px] font-light text-cream leading-[1] mb-1">{activePreloved.length}</div>
            <div className="hero-stat-label text-[10px] text-cream/40 font-medium tracking-[0.5px]">Preloved</div>
          </div>
          <div className="hero-stat bg-cream/[0.06] border border-cream/[0.08] rounded-xl p-5 text-center min-w-[120px] backdrop-blur-[8px]">
            <div className="hero-stat-num font-display text-[36px] font-light text-cream leading-[1] mb-1">{openRequests.length}</div>
            <div className="hero-stat-label text-[10px] text-cream/40 font-medium tracking-[0.5px]">Request</div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="stats-grid grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatCard icon="📦" iconBgClass="bg-sage-pale text-sage-dark" label="Jastip Aktif" value={activeJastip.length.toString()} delta={{ value: "Diperbarui hari ini", isUp: true }} />
        <StatCard icon="🛍️" iconBgClass="bg-terracotta-pale text-terracotta-dark" label="Preloved Dijual" value={activePreloved.length.toString()} delta={{ value: "Banyak pilihan", isUp: true }} />
        <StatCard icon="📍" iconBgClass="bg-gold-pale text-gold-dark" label="Request Terbuka" value={openRequests.length.toString()} delta={{ value: "Siap diambil", isUp: true }} />
        <StatCard icon="👥" iconBgClass="bg-cream-dark text-charcoal-60" label="Total Listing" value={(jastipListings?.length || 0).toString()} delta={{ value: "Semua jastip", isUp: true }} />
      </div>

      {/* ── JASTIP + RIGHT PANEL ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        {/* Jastip List */}
        <section>
          <div className="section-header flex justify-between items-center mb-5">
            <div>
              <h2 className="section-title font-display text-[22px] font-medium text-charcoal">Jastip Tersedia</h2>
              <div className="section-subtitle text-[13px] text-charcoal-60 mt-[2px]">Jastip aktif di sekitar Malang</div>
            </div>
            <button onClick={() => navigate('/jastip/listings')} className="btn btn-sm btn-outline rounded-full text-[12px] font-semibold border-[1.5px] border-charcoal-30 text-charcoal py-2 px-4 hover:border-charcoal hover:bg-charcoal-10 transition-colors">
              Lihat Semua →
            </button>
          </div>

          <CategoryScroll 
            type="jastip" 
            selectedId={selectedJastipCat} 
            onSelect={setSelectedJastipCat} 
          />

          <div className="jastip-grid flex flex-col gap-4">
            {isLoadingJastip ? (
              <div className="py-10 text-center text-charcoal-60 flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5 text-sage" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Memuat jastip...
              </div>
            ) : activeJastip.length > 0 ? (
              activeJastip.slice(0, 3).map((listing) => (
                <JastipCard 
                  key={listing.id}
                  user={{ name: listing.user?.name || "User", avatarClass: "bg-gradient-to-br from-sage to-sage-dark", avatarInitial: (listing.user?.name || "U").charAt(0).toUpperCase(), wa_number: listing.user?.wa_number }}
                  timeAgo={new Date(listing.created_at || '').toLocaleDateString('id-ID')}
                  status={listing.status}
                  route={{ from: listing.from_loc, to: listing.to_loc }}
                  tags={[listing.category ? `${listing.category.icon || ''} ${listing.category.name}`.trim() : "Umum"]}
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
              <div className="py-10 text-center text-charcoal-60 border border-dashed border-subtle rounded-xl bg-elevated">Belum ada jastip tersedia saat ini.</div>
            )}
          </div>
        </section>

        {/* Right Panel — Quick Actions + Activity */}
        <aside className="flex flex-col gap-6">
          {/* Quick Actions */}
          <div className="bg-elevated rounded-xl shadow-sm border border-subtle p-5">
            <h3 className="font-display text-[16px] font-medium text-charcoal mb-4">Aksi Cepat</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "📦", label: "Buka Jastip", desc: "Buat jastip baru", bg: "bg-sage-pale", path: "/jastip/listings/create" },
                { icon: "🛍️", label: "Jual Barang", desc: "Post preloved", bg: "bg-terracotta-pale", path: "/preloved/listings/create" },
                { icon: "📍", label: "Request", desc: "Minta dititipin", bg: "bg-gold-pale", path: "/jastip/requests/create" },
                { icon: "🔍", label: "Cari", desc: "Cari barang", bg: "bg-cream-dark", path: "/preloved/listings" },
              ].map((a) => (
                <button key={a.path} onClick={() => navigate(a.path)} className={`${a.bg} rounded-lg p-4 text-left cursor-pointer transition-transform duration-100 hover:scale-[0.98] hover:shadow-sm flex flex-col gap-2`}>
                  <span className="text-[22px]">{a.icon}</span>
                  <span className="text-[12px] font-semibold text-charcoal">{a.label}</span>
                  <span className="text-[10px] text-charcoal-60">{a.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-elevated rounded-xl shadow-sm border border-subtle overflow-hidden">
            <div className="px-5 py-4 border-b border-subtle flex justify-between items-center">
              <h3 className="font-display text-[16px] font-medium text-charcoal">Aktivitas Terbaru</h3>
              <span className="text-[11px] font-semibold text-charcoal-60 bg-cream-dark rounded-full py-1 px-3 cursor-pointer">Semua</span>
            </div>
            <div className="px-5 py-3">
              {jastipListings?.slice(0, 4).map((l, i) => (
                <div key={l.id} className="flex items-start gap-3 py-3 border-b border-subtle last:border-b-0">
                  <div className={`w-2 h-2 rounded-full mt-[5px] flex-shrink-0 ${i % 3 === 0 ? 'bg-sage' : i % 3 === 1 ? 'bg-terracotta' : 'bg-gold'}`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-charcoal leading-[1.3] truncate">Jastip {l.from_loc} → {l.to_loc}</div>
                    <div className="text-[11px] text-charcoal-60 mt-[1px]">{l.user?.name || 'User'} · {l.status}</div>
                  </div>
                  <span className="text-[10px] text-charcoal-30 font-medium whitespace-nowrap mt-[2px]">
                    {new Date(l.created_at || '').toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              )) || (
                <div className="py-6 text-center text-[13px] text-charcoal-60">Belum ada aktivitas.</div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* ── PRELOVED MARKETPLACE ── */}
      <section className="w-full">
        <div className="section-header flex justify-between items-center mb-5">
          <div>
            <h2 className="section-title font-display text-[22px] font-medium text-charcoal">Preloved Marketplace</h2>
            <div className="section-subtitle text-[13px] text-charcoal-60 mt-[2px]">Barang preloved dari mahasiswa Malang</div>
          </div>
          <button onClick={() => navigate('/preloved/listings')} className="btn btn-sm btn-outline rounded-full text-[12px] font-semibold border-[1.5px] border-charcoal-30 text-charcoal py-2 px-4 hover:border-charcoal hover:bg-charcoal-10 transition-colors">
            Lihat Semua →
          </button>
        </div>

        <CategoryScroll 
          type="preloved" 
          selectedId={selectedPrelovedCat} 
          onSelect={setSelectedPrelovedCat} 
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoadingPreloved ? (
            <div className="col-span-full py-10 text-center text-charcoal-60 flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5 text-terracotta" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Memuat preloved...
            </div>
          ) : activePreloved.length > 0 ? (
            activePreloved.slice(0, 8).map((listing, idx) => (
              <PrelovedCard 
                key={listing.id}
                featured={idx === 0}
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
            <div className="col-span-full py-10 text-center text-charcoal-60 border border-dashed border-subtle rounded-xl bg-elevated">Belum ada barang preloved.</div>
          )}
        </div>
      </section>
    </div>
  );
}
