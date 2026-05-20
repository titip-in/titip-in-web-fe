import React, { useState } from "react";
import { usePrelovedRequests } from "@/hooks/usePreloved";
import { PrelovedCard } from "@/components/home/PrelovedCard";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useActiveItemCount } from "@/hooks/useActiveItemCount";
import { makeWhatsAppUrl, formatRupiah } from "@/lib/utils";
import {
  AlertDialog, AlertDialogAction, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function PrelovedRequestsPage() {
  const { data: requests, isLoading } = usePrelovedRequests();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { isPrelovedRequestLimitReached, prelovedRequestActiveCount, ACTIVE_LIMIT } = useActiveItemCount();
  const [limitDialogOpen, setLimitDialogOpen] = useState(false);

  const handleCreateClick = () => {
    if (isPrelovedRequestLimitReached) { setLimitDialogOpen(true); return; }
    navigate('/preloved/requests/create');
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="section-header flex justify-between items-center mb-6">
        <div>
          <h1 className="font-display text-[28px] font-medium text-charcoal leading-tight">Cari Barang Preloved</h1>
          <p className="text-[14px] text-charcoal-60 mt-1">Butuh barang tapi belum ada yang jual? Buat request barang preloved</p>
        </div>
        <button 
          onClick={handleCreateClick}
          className="btn btn-md btn-primary bg-charcoal text-cream rounded-full font-body font-semibold px-6 py-3 text-[14px] hover:bg-charcoal-80 shadow-sm transition-all active:scale-[0.97] flex items-center gap-2"
        >
          🔍 Buat Request
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-charcoal/5 p-1 rounded-full mb-6 w-full max-w-[400px]">
        <NavLink 
          to="/preloved/listings" 
          className={({ isActive }) => `flex-1 py-2.5 text-center text-[13px] font-semibold rounded-full transition-all ${isActive ? 'bg-white shadow-sm text-charcoal' : 'text-charcoal-60 hover:text-charcoal'}`}
        >
          Jual
        </NavLink>
        <NavLink 
          to="/preloved/requests" 
          className={({ isActive }) => `flex-1 py-2.5 text-center text-[13px] font-semibold rounded-full transition-all ${isActive ? 'bg-white shadow-sm text-charcoal' : 'text-charcoal-60 hover:text-charcoal'}`}
        >
          Cari
        </NavLink>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 stagger-children">
        {isLoading ? (
          <div className="col-span-full py-20 text-center text-charcoal-60 flex flex-col items-center">
            <svg className="animate-spin h-8 w-8 mb-4 text-gold" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Memuat request preloved...
          </div>
        ) : requests && requests.length > 0 ? (
          requests.map((request) => (
            <PrelovedCard 
              key={request.id}
              user={{ 
                name: request.user?.name || "User", 
                avatarClass: "bg-gradient-to-br from-gold to-gold-dark", 
                avatarInitial: (request.user?.name || "U").charAt(0).toUpperCase(), 
                avatar_url: request.user?.avatar_url,
                wa_number: request.user?.wa_number 
              }}
              timeAgo={new Date(request.created_at || '').toLocaleDateString('id-ID')}
              status={request.status}
              title={request.title}
              maxPrice={request.max_price}
              category={request.category ? `${request.category.icon || ''} ${request.category.name}`.trim() : undefined}
              description={request.description}
              actionText="Jual Barang Ini"
              isOwner={request.user_id === user?.id}
              hideImage={true}
              onClick={() => navigate(`/preloved/requests/${request.id}`)}
              onWhatsApp={(wa) => {
                const budgetText = request.max_price ? formatRupiah(request.max_price) : 'Nego';
                const message = `Halo ${request.user?.name || ''}, saya melihat Anda sedang mencari barang preloved '${request.title}' dengan budget maksimal ${budgetText} di Titip.in. Saya memiliki barang tersebut dan ingin menawarkannya.`;
                window.open(makeWhatsAppUrl(wa, message), '_blank');
              }}
            />
          ))
        ) : (
          <div className="col-span-full py-16 text-center border-2 border-dashed border-subtle rounded-2xl text-charcoal-60 bg-elevated">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-lg font-semibold text-charcoal mb-1">Belum ada Request</h3>
            <p>Belum ada yang mencari barang saat ini.</p>
          </div>
        )}
      </div>

      <AlertDialog open={limitDialogOpen} onOpenChange={setLimitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="text-4xl mb-2 text-center">🚫</div>
            <AlertDialogTitle className="text-center">Batas Aktif Tercapai</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Kamu sudah memiliki <strong>{prelovedRequestActiveCount}/{ACTIVE_LIMIT}</strong> preloved request aktif.<br/><br/>
              Tutup atau hapus salah satu request sebelum membuat yang baru.
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
