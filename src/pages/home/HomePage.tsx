import { StatCard } from "@/components/home/StatCard";
import { JastipCard } from "@/components/home/JastipCard";
import { PrelovedCard } from "@/components/home/PrelovedCard";
import { useAuthStore } from "@/stores/authStore";
import { useJastipListings, useJastipRequests } from "@/hooks/useJastip";
import { usePrelovedListings } from "@/hooks/usePreloved";
import { CategoryScroll } from "@/components/ui/CategoryScroll";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useCategories } from "@/hooks/useCategory";
import { useActiveItemCount } from "@/hooks/useActiveItemCount";
import { formatTimeAgoShort } from "@/lib/dateUtils";
import { SetupProfileDialog } from "@/components/profile/SetupProfileDialog";
import { useActivity } from "@/hooks/useActivity";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function HomePage() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const { data: jastipListings, isLoading: isLoadingJastip } = useJastipListings();
  const { data: jastipRequests } = useJastipRequests();
  const { data: prelovedListings, isLoading: isLoadingPreloved } = usePrelovedListings();
  const { data: categories } = useCategories();
  const { data: activities } = useActivity(5);

  const [selectedJastipCat, setSelectedJastipCat] = useState<number | null>(null);
  const [selectedPrelovedCat, setSelectedPrelovedCat] = useState<number | null>(null);

  const {
    isJastipListingLimitReached,
    isJastipRequestLimitReached,
    isPrelovedListingLimitReached,
    jastipListingActiveCount,
    jastipRequestActiveCount,
    prelovedListingActiveCount,
    ACTIVE_LIMIT
  } = useActiveItemCount();

  const [limitDialogOpen, setLimitDialogOpen] = useState(false);
  const [limitDialogData, setLimitDialogData] = useState({ count: 0, type: "" });
  
  const [isSetupOpen, setIsSetupOpen] = useState(false);

  React.useEffect(() => {
    if (user && !user.status && !user.avatar_url) {
      const dismissed = localStorage.getItem(`setup_dismissed_${user.id}`);
      if (!dismissed) {
        // Delay a bit for smooth entrance
        const timer = setTimeout(() => setIsSetupOpen(true), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  const handleDismissSetup = () => {
    setIsSetupOpen(false);
    if (user) {
      localStorage.setItem(`setup_dismissed_${user.id}`, "true");
    }
  };

  const handleCreateClick = (type: "jastip-listing" | "jastip-request" | "preloved-listing", path: string) => {
    let isLimited = false;
    let count = 0;
    let typeLabel = "";

    switch (type) {
      case "jastip-listing":
        isLimited = isJastipListingLimitReached;
        count = jastipListingActiveCount;
        typeLabel = "jastip listing";
        break;
      case "jastip-request":
        isLimited = isJastipRequestLimitReached;
        count = jastipRequestActiveCount;
        typeLabel = "jastip request";
        break;
      case "preloved-listing":
        isLimited = isPrelovedListingLimitReached;
        count = prelovedListingActiveCount;
        typeLabel = "preloved listing";
        break;
    }

    if (isLimited) {
      setLimitDialogData({ count, type: typeLabel });
      setLimitDialogOpen(true);
      return;
    }
    navigate(path);
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
            Jastip & Preloved<br />di Malang
          </h1>
          <p className="hero-desc text-[13px] sm:text-[14px] lg:text-[15px] text-cream/45 leading-[1.6] mb-4 sm:mb-6 max-w-[440px]">
            Platform hyperlocal untuk mahasiswa Malang. Temukan jastip terdekat dan barang preloved dengan mudah — langsung hubungi via WhatsApp.
          </p>
          <div className="hero-actions flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => handleCreateClick('jastip-listing', '/jastip/listings/create')}
              className="btn btn-md btn-terra bg-terracotta text-white rounded-full font-body font-semibold px-4 sm:px-6 py-2.5 sm:py-3 text-[13px] sm:text-[14px] hover:bg-terracotta-dark shadow-sm transition-all duration-100 ease-out hover:shadow-md active:scale-[0.97] flex items-center gap-2"
            >
              📦 Buka Jastip
            </button>
            <button
              onClick={() => handleCreateClick('preloved-listing', '/preloved/listings/create')}
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
        <StatCard 
          onClick={() => navigate('/jastip/listings')}
          icon="📦" iconBgClass="bg-sage-pale text-sage-dark" label="Jastip Aktif" value={activeJastip.length.toString()} delta={{ value: "Diperbarui hari ini", isUp: true }} 
        />
        <StatCard 
          onClick={() => navigate('/preloved/listings')}
          icon="🛍️" iconBgClass="bg-terracotta-pale text-terracotta-dark" label="Preloved Dijual" value={activePreloved.length.toString()} delta={{ value: "Banyak pilihan", isUp: true }} 
        />
        <StatCard 
          onClick={() => navigate('/jastip/requests')}
          icon="📍" iconBgClass="bg-gold-pale text-gold-dark" label="Request Terbuka" value={openRequests.length.toString()} delta={{ value: "Siap diambil", isUp: true }} 
        />
        <StatCard 
          onClick={() => navigate('/jastip/mine')}
          icon="👥" iconBgClass="bg-cream-dark text-charcoal-60" label="Total Listing" value={(jastipListings?.length || 0).toString()} delta={{ value: "Semua jastip", isUp: true }} 
        />
      </div>

      {/* ── JASTIP + RIGHT PANEL ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Jastip List */}
        <section className="lg:col-span-2">
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
                  user={{
                    name: (listing.user_id === user?.id ? user?.name : listing.user?.name) || "User",
                    avatarClass: "bg-gradient-to-br from-sage to-sage-dark",
                    avatarInitial: ((listing.user_id === user?.id ? user?.name : listing.user?.name) || "U").charAt(0).toUpperCase(),
                    avatar_url: listing.user_id === user?.id ? user?.avatar_url : listing.user?.avatar_url,
                    wa_number: (listing.user_id === user?.id ? user?.wa_number : listing.user?.wa_number) || ""
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
              <div className="py-10 text-center text-charcoal-60 border border-dashed border-subtle rounded-xl bg-elevated">Belum ada jastip tersedia saat ini.</div>
            )}
          </div>
        </section>

        {/* Right Panel — Quick Actions + Activity */}
        <aside className="flex flex-col gap-6 lg:col-span-1">
          {/* Quick Actions */}
          <div className="bg-elevated rounded-xl shadow-sm border border-subtle p-5">
            <h3 className="font-display text-[16px] font-medium text-charcoal mb-4">Aksi Cepat</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "📦", label: "Buka Jastip", desc: "Buat jastip baru", bg: "bg-sage-pale", path: "/jastip/listings/create", type: "jastip-listing" as const },
                { icon: "🛍️", label: "Jual Barang", desc: "Post preloved", bg: "bg-terracotta-pale", path: "/preloved/listings/create", type: "preloved-listing" as const },
                { icon: "📍", label: "Request", desc: "Minta dititipin", bg: "bg-gold-pale", path: "/jastip/requests/create", type: "jastip-request" as const },
                { icon: "🔍", label: "Cari", desc: "Cari barang", bg: "bg-cream-dark", path: "/preloved/listings", type: null },
              ].map((a) => (
                <button
                  key={a.path}
                  onClick={() => a.type ? handleCreateClick(a.type, a.path) : navigate(a.path)}
                  className={`${a.bg} rounded-lg p-4 text-left cursor-pointer transition-transform duration-100 hover:scale-[0.98] hover:shadow-sm flex flex-col gap-2`}
                >
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
              <span onClick={() => navigate('/jastip/listings')} className="text-[11px] font-semibold text-charcoal-60 bg-cream-dark rounded-full py-1 px-3 cursor-pointer hover:bg-charcoal-10 transition-colors">Semua</span>
            </div>
            <div className="px-5 py-3">
              {activities && activities.length > 0 ? (
                activities.slice(0, 5).map((a, i) => (
                  <div key={`${a.type}-${a.id}`} className="flex items-start gap-3 py-3 border-b border-subtle last:border-b-0 cursor-pointer hover:bg-black/5 transition-colors px-1 -mx-1 rounded-lg"
                    onClick={() => {
                      const path = a.type === 'jastip-listing' ? `/jastip/listings/${a.id}` 
                                 : a.type === 'jastip-request' ? `/jastip/requests/${a.id}`
                                 : a.type === 'preloved-listing' ? `/preloved/listings/${a.id}`
                                 : `/preloved/requests/${a.id}`;
                      navigate(path);
                    }}
                  >
                    <div className={`w-2 h-2 rounded-full mt-[5px] flex-shrink-0 ${
                      a.type.startsWith('jastip') ? 'bg-sage' : 'bg-terracotta'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-charcoal leading-[1.3] flex flex-wrap gap-x-1">
                        <span className="truncate max-w-[70px] shrink-0">{a.user_name}</span>
                        <span className="text-charcoal-40 font-normal">
                           {a.type === 'jastip-listing' ? 'buka jastip' 
                             : a.type === 'jastip-request' ? 'mencari jastip'
                             : a.type === 'preloved-listing' ? 'menjual'
                             : 'mencari'}
                        </span>
                        <span className="truncate italic">{a.title}</span>
                      </div>
                      <div className="text-[11px] text-charcoal-40 mt-[1px] flex items-center justify-between">
                        <span>{a.status}</span>
                        <span>{formatTimeAgoShort(a.created_at)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-[13px] text-charcoal-60">Belum ada aktivitas.</div>
              )}
            </div>
          </div>

          {/* Trust Badge / Security Info */}
          <div className="bg-sage-pale/60 border border-sage/20 rounded-xl p-4 flex items-start gap-3 mt-auto">
            <div className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center shrink-0 text-[16px]">
              🛡️
            </div>
            <div>
              <h4 className="font-semibold text-[12px] text-sage-dark mb-0.5">Transaksi Lebih Aman</h4>
              <p className="text-[11px] text-sage-dark/80 leading-[1.4]">Selalu cek detail barang & sepakati COD di area kampus untuk keamanan bersama.</p>
            </div>
          </div>

          {/* Support Info */}
          <div className="bg-gold-pale/60 border border-gold/20 rounded-xl p-4 flex items-start gap-3 mt-4">
            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center shrink-0 text-gold-dark">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <div>
              <h4 className="font-semibold text-[12px] text-gold-dark mb-0.5">Butuh Bantuan?</h4>
              <p className="text-[11px] text-gold-dark/80 leading-[1.4] mb-1.5">Ada kendala atau pertanyaan seputar Titip.in?</p>
              <a href="mailto:support@titipin.me" className="text-[11px] font-bold text-gold-dark hover:underline">Hubungi support@titipin.me</a>
            </div>
          </div>

          {/* CTA Promo Banner */}
          <div className="bg-gradient-to-br from-terracotta to-terracotta-dark rounded-xl shadow-sm overflow-hidden relative p-6 text-white flex-1 flex flex-col justify-center">
            {/* Decorative blobs */}
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-charcoal/20 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <span className="inline-block px-2 py-1 bg-white/20 rounded mb-3 text-[9px] font-bold tracking-wider uppercase text-white backdrop-blur-sm">
                TIPS CUAN 💸
              </span>
              <h3 className="font-display text-[20px] font-medium leading-tight mb-2">
                Barang nganggur<br />di kos?
              </h3>
              <p className="text-[13px] text-white/85 mb-5 leading-[1.5]">
                Ubah jadi uang saku tambahan. Upload ke preloved marketplace, langsung dibeli teman kampus!
              </p>
              <button
                onClick={() => handleCreateClick('preloved-listing', '/preloved/listings/create')}
                className="w-full py-2.5 bg-white text-terracotta-dark text-[13px] font-bold rounded-full shadow-sm hover:bg-cream transition-transform duration-200 hover:-translate-y-0.5 active:scale-95 mt-auto"
              >
                Mulai Jual Barang
              </button>
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

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {isLoadingPreloved ? (
            <div className="col-span-full py-10 text-center text-charcoal-60 flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5 text-terracotta" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Memuat preloved...
            </div>
          ) : activePreloved.length > 0 ? (
            activePreloved.slice(0, 8).map((listing, idx) => (
              <PrelovedCard
                key={listing.id}
                featured={idx < 2}
                user={{
                  name: (listing.user_id === user?.id ? user?.name : listing.user?.name) || "User",
                  avatarClass: "bg-gradient-to-br from-terracotta to-terracotta-dark",
                  avatarInitial: ((listing.user_id === user?.id ? user?.name : listing.user?.name) || "U").charAt(0).toUpperCase(),
                  avatar_url: listing.user_id === user?.id ? user?.avatar_url : listing.user?.avatar_url,
                  wa_number: (listing.user_id === user?.id ? user?.wa_number : listing.user?.wa_number) || ""
                }}
                timeAgo={new Date(listing.created_at || '').toLocaleDateString('id-ID')}
                status={listing.status}
                title={listing.title}
                price={listing.price}
                condition={listing.condition}
                category={getCategoryTag(listing)}
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
      
      <AlertDialog open={limitDialogOpen} onOpenChange={setLimitDialogOpen}>
        <AlertDialogContent className="bg-cream border-cream-dark rounded-2xl max-w-[400px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">Batas Aktif Tercapai</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Kamu sudah memiliki <strong>{limitDialogData.count}/{ACTIVE_LIMIT}</strong> {limitDialogData.type} aktif.
              <br /><br />Tutup atau hapus salah satu item yang sudah tidak aktif sebelum membuat yang baru.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="bg-charcoal text-white rounded-full w-full">Mengerti</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <SetupProfileDialog 
        isOpen={isSetupOpen} 
        onClose={handleDismissSetup} 
      />
    </div>
  );
}
