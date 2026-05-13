import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export function Topbar() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="topbar bg-charcoal flex items-center px-6 gap-4 sticky top-0 z-[300]" style={{ gridColumn: "1 / -1", height: "var(--topbar-h)" }}>
      {/* Logo */}
      <Link to="/" className="topbar-logo font-display text-[22px] italic font-normal text-cream tracking-tight whitespace-nowrap">
        Titip.in
      </Link>

      <div className="topbar-divider w-[1px] h-[22px] bg-cream/10"></div>

      <div className="topbar-breadcrumb flex items-center gap-2 text-[13px] text-cream/40">
        <span>Beranda</span>
      </div>

      <div className="topbar-actions flex items-center gap-3 ml-auto">
        <div className="topbar-search bg-white/5 border border-white/5 rounded-full py-2 px-4 flex items-center gap-2 cursor-pointer transition-colors duration-100 min-w-[240px] hover:bg-white/10">
          <svg className="topbar-search-icon text-[14px] opacity-50 text-cream w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <span className="topbar-search-text text-[13px] text-cream/35 font-body">Cari sesuatu...</span>
          <span className="topbar-search-kbd ml-auto text-[10px] text-cream/25 bg-white/10 py-[2px] px-1.5 rounded font-body font-semibold">⌘K</span>
        </div>

        <button className="topbar-icon-btn w-9 h-9 rounded-md bg-white/5 border-none flex items-center justify-center cursor-pointer relative transition-colors duration-100 text-cream/60 hover:bg-white/10">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
          <span className="topbar-notif-dot absolute top-[6px] right-[7px] w-[7px] h-[7px] bg-terracotta rounded-full border-2 border-charcoal"></span>
        </button>

        <div className="topbar-avatar w-[34px] h-[34px] rounded-full bg-gradient-to-br from-sage to-terracotta flex items-center justify-center text-[13px] font-bold text-white cursor-pointer border-2 border-cream/15 transition-colors duration-100 hover:border-cream/35">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
}
