import React from "react";
import { useJastipRequests } from "@/hooks/useJastip";
import { JastipCard } from "@/components/home/JastipCard";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export default function JastipRequestsPage() {
  const { data: requests, isLoading } = useJastipRequests();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  return (
    <div className="w-full animate-fade-in">
      <div className="section-header flex justify-between items-center mb-6">
        <div>
          <h1 className="font-display text-[28px] font-medium text-charcoal leading-tight">Request Jastip</h1>
          <p className="text-[14px] text-charcoal-60 mt-1">Temukan penitip yang butuh bantuan — ambil request untuk fee tambahan</p>
        </div>
        <button 
          onClick={() => navigate('/jastip/requests/create')}
          className="btn btn-md btn-primary bg-charcoal text-cream rounded-full font-body font-semibold px-6 py-3 text-[14px] hover:bg-charcoal-80 shadow-sm transition-all active:scale-[0.97] flex items-center gap-2"
        >
          📍 Buat Request
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
        {isLoading ? (
          <div className="col-span-full py-20 text-center text-charcoal-60 flex flex-col items-center">
            <svg className="animate-spin h-8 w-8 mb-4 text-gold" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Memuat request jastip...
          </div>
        ) : requests && requests.length > 0 ? (
          requests.map((request) => (
            <JastipCard 
              key={request.id}
              user={{ name: request.user?.name || "User", avatarClass: "bg-gradient-to-br from-gold to-gold-dark", avatarInitial: (request.user?.name || "U").charAt(0).toUpperCase(), wa_number: request.user?.wa_number }}
              timeAgo={new Date(request.created_at || '').toLocaleDateString('id-ID')}
              status={request.status}
              title={request.title}
              route={{ from: request.from_loc, to: request.to_loc }}
              tags={[request.category ? `${request.category.icon || ''} ${request.category.name}`.trim() : "Umum"]}
              notes={request.notes || undefined}
              actionText="Ambil Request"
              isOwner={request.user_id === user?.id}
              hideImage={true}
              onClick={() => navigate(`/jastip/requests/${request.id}`)}
              onWhatsApp={(wa) => window.open(`https://wa.me/${wa}`, '_blank')}
            />
          ))
        ) : (
          <div className="col-span-full py-16 text-center border-2 border-dashed border-subtle rounded-2xl text-charcoal-60 bg-elevated">
            <div className="text-4xl mb-3">📍</div>
            <h3 className="text-lg font-semibold text-charcoal mb-1">Belum ada Request</h3>
            <p>Belum ada yang mencari jastip saat ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
