import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAdminStore } from "@/stores/adminStore";
import { Users, Package, LogOut } from "lucide-react";
import { useAdminLogout } from "@/hooks/useAdmin";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin } = useAdminStore();
  const adminLogout = useAdminLogout();

  const handleLogout = () => {
    adminLogout.mutate();
  };

  return (
    <div className="min-h-screen bg-charcoal-10 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-charcoal text-cream flex flex-col shrink-0">
        <div className="p-6">
          <h2 className="font-display text-2xl font-bold text-white">Titip.in Admin</h2>
          <p className="text-xs text-cream/70 mt-1">Hello, {admin?.name || "Admin"}</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <Link 
            to="/hidupjokowi/users" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              location.pathname.includes('/hidupjokowi/users') 
                ? 'bg-terracotta text-white' 
                : 'text-cream/80 hover:bg-charcoal-80 hover:text-white'
            }`}
          >
            <Users size={18} />
            Pengguna
          </Link>
          <Link 
            to="/hidupjokowi/items" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              location.pathname.includes('/hidupjokowi/items') 
                ? 'bg-terracotta text-white' 
                : 'text-cream/80 hover:bg-charcoal-80 hover:text-white'
            }`}
          >
            <Package size={18} />
            Item / Listing
          </Link>
        </nav>

        <div className="p-4 border-t border-charcoal-80 mt-auto">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-lg font-medium text-cream/80 hover:bg-red-500 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
