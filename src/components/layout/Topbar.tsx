import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useState, useRef, useEffect } from "react";
import { useJastipListings } from "@/hooks/useJastip";
import { formatTimeAgoShort } from "@/lib/dateUtils";

export function Topbar() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const { data: jastipListings } = useJastipListings();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const isPrelovedContext = window.location.pathname.includes('/preloved');
      const type = isPrelovedContext ? 'preloved' : 'jastip';
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}&type=${type}`);
      setIsMobileSearchActive(false);
    }
  };

  useEffect(() => {
    if (isMobileSearchActive) {
      mobileInputRef.current?.focus();
    }
  }, [isMobileSearchActive]);

  return (
    <header className="topbar bg-charcoal flex items-center px-6 gap-4 z-[300]" style={{ gridColumn: "1 / -1", height: "var(--topbar-h)" }}>
      {/* Logo */}
      {/* Logo */}
      {!isMobileSearchActive && (
        <>
          <Link to="/" className="topbar-logo font-display text-[22px] italic font-normal text-cream tracking-tight whitespace-nowrap">
            Titip.in
          </Link>

          <div className="topbar-divider w-[1px] h-[22px] bg-cream/10 hidden sm:block"></div>

          <div className="topbar-breadcrumb items-center gap-2 text-[13px] text-cream/40 hidden sm:flex">
            <span>Buat dan Cari Jastip-Preloved</span>
          </div>
        </>
      )}

      <div className={`topbar-actions flex items-center gap-3 ${isMobileSearchActive ? 'w-full' : 'ml-auto'}`}>
        {/* Desktop Search (hidden on mobile via CSS usually, but we manage it here too) */}
        <form 
          onSubmit={handleSearch} 
          className={`topbar-search bg-white/5 border border-white/5 rounded-full py-2 px-4 items-center gap-2 transition-colors duration-100 min-w-[240px] focus-within:bg-white/10 hidden sm:flex`}
        >
          <svg className="topbar-search-icon text-[14px] opacity-50 text-cream w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari jastip atau barang..."
            className="topbar-search-text text-[13px] text-cream bg-transparent border-none outline-none w-full placeholder:text-cream/35 font-body"
          />
          <span className="topbar-search-kbd ml-auto text-[10px] text-cream/25 bg-white/10 py-[2px] px-1.5 rounded font-body font-semibold">↵</span>
        </form>

        {/* Mobile Search Active State */}
        {isMobileSearchActive && (
          <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2 bg-white/10 rounded-full py-2 px-4 border border-white/10 sm:hidden animate-in slide-in-from-right-4 duration-200">
            <button 
              type="button" 
              onClick={() => setIsMobileSearchActive(false)}
              className="p-1 text-cream/40 hover:text-cream"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <input
              ref={mobileInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari jastip/barang..."
              className="flex-1 text-[14px] text-cream bg-transparent border-none outline-none placeholder:text-cream/30"
            />
            {searchQuery && (
              <button type="submit" className="text-sage text-[13px] font-bold">Cari</button>
            )}
          </form>
        )}

        {/* Mobile search toggle button */}
        {!isMobileSearchActive && (
          <button
            onClick={() => setIsMobileSearchActive(true)}
            className="topbar-mobile-search w-9 h-9 rounded-md bg-white/5 border-none flex items-center justify-center cursor-pointer text-cream/60 hover:bg-white/10 transition-colors sm:hidden"
            aria-label="Cari"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </button>
        )}

        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`topbar-icon-btn w-9 h-9 rounded-md border-none flex items-center justify-center cursor-pointer relative transition-all duration-100 ${isNotifOpen ? 'bg-white/20 text-cream' : 'bg-white/5 text-cream/60 hover:bg-white/10'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
            <span className="topbar-notif-dot absolute top-[6px] right-[7px] w-[7px] h-[7px] bg-terracotta rounded-full border-2 border-charcoal"></span>
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-[320px] bg-charcoal border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[500] animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-5 py-4 border-b border-white/5 bg-white/5">
                <h3 className="text-[14px] font-semibold text-cream">Aktivitas Terbaru</h3>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {jastipListings && jastipListings.length > 0 ? (
                  jastipListings.slice(0, 5).map((l, i) => (
                    <button
                      key={l.id}
                      onClick={() => {
                        navigate(`/jastip/listings/${l.id}`);
                        setIsNotifOpen(false);
                      }}
                      className="w-full text-left px-5 py-4 border-b border-white/5 hover:bg-white/5 transition-colors flex items-start gap-3 last:border-b-0"
                    >
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${i % 2 === 0 ? 'bg-sage' : 'bg-terracotta'}`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium text-cream leading-[1.3] flex items-center gap-1">
                          <span className="truncate max-w-[80px] inline-block shrink-0">{l.user?.name || 'Seseorang'}</span>
                          <span className="truncate">buka jastip {l.from_loc}</span>
                        </div>
                        <div className="text-[11px] text-cream/40 mt-1">
                          {formatTimeAgoShort(l.created_at || '')}
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-5 py-10 text-center text-cream/30 text-[13px]">
                    Belum ada aktivitas terbaru.
                  </div>
                )}
              </div>
              <div className="px-5 py-3 bg-white/5 border-t border-white/5 text-center">
                <button 
                  onClick={() => { navigate('/jastip/listings'); setIsNotifOpen(false); }}
                  className="text-[11px] font-bold text-cream/60 hover:text-cream transition-colors"
                >
                  Lihat Semua Aktivitas
                </button>
              </div>
            </div>
          )}
        </div>

        <Link to="/profile" className="topbar-avatar w-[34px] h-[34px] rounded-full bg-gradient-to-br from-sage to-terracotta flex items-center justify-center text-[13px] font-bold text-white cursor-pointer border-2 border-cream/15 transition-colors duration-100 hover:border-cream/35 overflow-hidden flex-shrink-0">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            user?.name?.charAt(0).toUpperCase() || "U"
          )}
        </Link>
      </div>
    </header>
  );
}
