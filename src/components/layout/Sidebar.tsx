import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const mainNav = [
    { name: "Beranda", path: "/", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  ];

  const jastipNav = [
    { name: "Listing Jastip", path: "/jastip/listings", icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { name: "Request Jastip", path: "/jastip/requests", icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" },
    { name: "Jastip Saya", path: "/jastip/mine", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  ];

  const prelovedNav = [
    { name: "Jual Preloved", path: "/preloved/listings", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" },
    { name: "Cari Preloved", path: "/preloved/requests", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
    { name: "Preloved Saya", path: "/preloved/mine", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  ];

  const profileNav = [
    { name: "Profil Saya", path: "/profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  ];

  const NavGroup = ({ items }: { items: any[] }) => (
    <div className="flex flex-col gap-1">
      {items.map((item) => {
        const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
        // Handle exact match for home to prevent it being always active
        const isActuallyActive = item.path === '/' ? location.pathname === '/' : isActive;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-item flex items-center gap-3 py-2.5 px-3 rounded-md text-[13px] cursor-pointer transition-all duration-100 ease-out no-underline relative ${
              isActuallyActive ? "bg-white/10 text-cream font-medium" : "text-cream/45 hover:bg-white/5 hover:text-cream"
            }`}
          >
            {isActuallyActive && (
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
  );

  return (
    <aside className="sidebar bg-charcoal p-5 border-r border-white/5 overflow-y-auto sticky top-[var(--topbar-h)] h-[calc(100vh-var(--topbar-h))] flex flex-col w-[var(--sidebar-w)]">
      
      <div className="sidebar-section mb-5">
        <NavGroup items={mainNav} />
      </div>

      <div className="sidebar-section mb-5">
        <div className="sidebar-label text-[9px] font-bold tracking-[2.5px] uppercase text-cream/20 mb-2 px-2">Jastip</div>
        <NavGroup items={jastipNav} />
      </div>

      <div className="sidebar-section mb-5">
        <div className="sidebar-label text-[9px] font-bold tracking-[2.5px] uppercase text-cream/20 mb-2 px-2">Preloved</div>
        <NavGroup items={prelovedNav} />
      </div>

      <div className="sidebar-section mb-5">
        <div className="sidebar-label text-[9px] font-bold tracking-[2.5px] uppercase text-cream/20 mb-2 px-2">Akun</div>
        <NavGroup items={profileNav} />
      </div>

      <div className="sidebar-footer mt-auto pt-4 border-t border-white/5 flex items-center gap-3">
        {user?.avatar_url ? (
          <img src={user.avatar_url} alt={user.name} className="sidebar-footer-avatar w-9 h-9 rounded-full object-cover flex-shrink-0 border border-white/10" />
        ) : (
          <div className="sidebar-footer-avatar w-9 h-9 rounded-full bg-gradient-to-br from-sage to-terracotta flex items-center justify-center text-[14px] font-bold text-white flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
        )}
        <div className="sidebar-footer-info flex-1 min-w-0">
          <div className="sidebar-footer-name text-[13px] font-semibold text-cream whitespace-nowrap overflow-hidden text-ellipsis">
            {user?.name || "User"}
          </div>
          <div className="sidebar-footer-role text-[10px] text-cream/30 capitalize">
            {user?.email || "Member"}
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
