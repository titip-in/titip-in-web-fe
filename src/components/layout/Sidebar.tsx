import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const navItems = [
    { name: "Beranda", path: "/", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { name: "Eksplor Jastip", path: "/jastip", icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { name: "Preloved Market", path: "/preloved", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" },
    { name: "Pesan", path: "/messages", icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z", badge: 3 },
  ];

  const profileItems = [
    { name: "Transaksi Saya", path: "/transactions", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
    { name: "Dompet", path: "/wallet", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
    { name: "Pengaturan", path: "/settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
  ];

  return (
    <aside className="sidebar bg-charcoal p-5 border-r border-white/5 overflow-y-auto sticky top-[var(--topbar-h)] h-[calc(100vh-var(--topbar-h))] flex flex-col w-[var(--sidebar-w)]">
      
      <div className="sidebar-section mb-5">
        <div className="sidebar-label text-[9px] font-bold tracking-[2.5px] uppercase text-cream/20 mb-2 px-2">Menu Utama</div>
        <div className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-item flex items-center gap-3 py-2.5 px-3 rounded-md text-[13px] cursor-pointer transition-all duration-100 ease-out no-underline relative ${
                  isActive ? "bg-white/10 text-cream font-medium" : "text-cream/45 hover:bg-white/5 hover:text-cream"
                }`}
              >
                {isActive && (
                  <div className="absolute left-[-20px] w-[3px] h-5 bg-terracotta rounded-r-[3px] top-1/2 -translate-y-1/2" />
                )}
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path>
                </svg>
                {item.name}
                {item.badge && (
                  <span className="ml-auto bg-terracotta text-white rounded-full text-[9px] font-bold py-[2px] px-[7px] leading-[1.4]">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="sidebar-section mb-5">
        <div className="sidebar-label text-[9px] font-bold tracking-[2.5px] uppercase text-cream/20 mb-2 px-2">Profil</div>
        <div className="flex flex-col gap-1">
          {profileItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-item flex items-center gap-3 py-2.5 px-3 rounded-md text-[13px] cursor-pointer transition-all duration-100 ease-out no-underline relative ${
                  isActive ? "bg-white/10 text-cream font-medium" : "text-cream/45 hover:bg-white/5 hover:text-cream"
                }`}
              >
                {isActive && (
                  <div className="absolute left-[-20px] w-[3px] h-5 bg-terracotta rounded-r-[3px] top-1/2 -translate-y-1/2" />
                )}
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path>
                </svg>
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="sidebar-footer mt-auto pt-4 border-t border-white/5 flex items-center gap-3">
        <div className="sidebar-footer-avatar w-9 h-9 rounded-full bg-gradient-to-br from-sage to-terracotta flex items-center justify-center text-[14px] font-bold text-white flex-shrink-0">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div className="sidebar-footer-info flex-1 min-w-0">
          <div className="sidebar-footer-name text-[13px] font-semibold text-cream whitespace-nowrap overflow-hidden text-ellipsis">
            {user?.name || "User"}
          </div>
          <div className="sidebar-footer-role text-[10px] text-cream/30 capitalize">
            {user?.role || "Member"}
          </div>
        </div>
        <button 
          onClick={() => logout()}
          className="sidebar-footer-btn w-7 h-7 rounded-sm bg-white/5 border-none flex items-center justify-center text-[12px] cursor-pointer text-cream/35 transition-colors hover:bg-white/10"
          title="Logout"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
        </button>
      </div>

    </aside>
  );
}
