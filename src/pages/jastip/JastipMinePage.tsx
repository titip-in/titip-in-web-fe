import React, { useState } from "react";
import { useMyJastipListings, useMyJastipRequests, useDeleteJastipListing, useDeleteJastipRequest } from "@/hooks/useJastip";
import { JastipCard } from "@/components/home/JastipCard";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function JastipMinePage() {
  const [activeTab, setActiveTab] = useState<"listings" | "requests">("listings");
  const { data: listings, isLoading: loadingListings } = useMyJastipListings();
  const { data: requests, isLoading: loadingRequests } = useMyJastipRequests();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteListing = useDeleteJastipListing();
  const deleteRequest = useDeleteJastipRequest();

  const isLoading = activeTab === "listings" ? loadingListings : loadingRequests;
  const currentData = activeTab === "listings" ? listings : requests;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<{title: string, description: string, action: () => Promise<void> | void}>({
    title: "",
    description: "",
    action: () => {}
  });

  const confirmAction = (title: string, description: string, action: () => Promise<void> | void) => {
    setDialogConfig({ title, description, action });
    setDialogOpen(true);
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    confirmAction(
      "Konfirmasi Ubah Status",
      `Ubah status menjadi ${newStatus === 'CLOSED' ? 'Ditutup' : 'Aktif'}?`,
      async () => {
        try {
          await api.put(`/v1/jastip/listings/${id}`, { status: newStatus });
          queryClient.invalidateQueries({ queryKey: ['jastip'] });
          toast.success("Status berhasil diubah.");
        } catch (err: any) {
          toast.error(err?.response?.data?.message || "Gagal mengubah status.");
        }
      }
    );
  };

  const handleDeleteListing = (id: string) => {
    confirmAction(
      "Hapus Jastip",
      "Yakin ingin menghapus jastip ini? Tindakan ini tidak dapat dibatalkan.",
      async () => {
        try {
          await deleteListing.mutateAsync(id);
          toast.success("Jastip berhasil dihapus.");
        } catch (err: any) {
          toast.error(err?.response?.data?.message || "Gagal menghapus.");
        }
      }
    );
  };

  const handleDeleteRequest = (id: string) => {
    confirmAction(
      "Hapus Request",
      "Yakin ingin menghapus request ini? Tindakan ini tidak dapat dibatalkan.",
      async () => {
        try {
          await deleteRequest.mutateAsync(id);
          toast.success("Request berhasil dihapus.");
        } catch (err: any) {
          toast.error(err?.response?.data?.message || "Gagal menghapus.");
        }
      }
    );
  };

  return (
    <div className="w-full animate-fade-in">
      {/* Header */}
      <section className="hero bg-charcoal rounded-2xl p-8 relative overflow-hidden mb-8">
        <div className="hero-blob w-[300px] h-[300px] bg-sage opacity-10 absolute rounded-full -top-[100px] -right-[80px]"></div>
        <div className="hero-blob w-[200px] h-[200px] bg-gold opacity-[0.08] absolute rounded-full bottom-0 left-[100px]"></div>
        <div className="relative z-[1]">
          <div className="hero-tag text-[11px] font-semibold tracking-[2px] text-sage uppercase mb-3 flex items-center gap-2">
            <span className="w-[5px] h-[5px] rounded-full bg-sage"></span> JASTIP SAYA
          </div>
          <h1 className="font-display text-[36px] font-light text-cream mb-2">Kelola Jastip</h1>
          <p className="text-[14px] text-cream/40 max-w-lg">Lihat dan kelola jastip yang kamu buka serta permintaan jastip yang sudah kamu buat.</p>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button 
          onClick={() => setActiveTab("listings")}
          className={`rounded-full py-2 px-5 text-[12px] font-semibold tracking-[0.3px] transition-all duration-100 flex items-center gap-2 ${
            activeTab === 'listings' ? 'bg-charcoal text-cream' : 'bg-cream-dark text-charcoal-60 hover:bg-cream-hover'
          }`}
        >
          📋 Listing Saya
          {listings && <span className={`py-[2px] px-[7px] rounded-full text-[9px] font-bold leading-[1.4] ${activeTab === 'listings' ? 'bg-terracotta text-white' : 'bg-charcoal-10 text-charcoal-60'}`}>{listings.length}</span>}
        </button>
        <button 
          onClick={() => setActiveTab("requests")}
          className={`rounded-full py-2 px-5 text-[12px] font-semibold tracking-[0.3px] transition-all duration-100 flex items-center gap-2 ${
            activeTab === 'requests' ? 'bg-charcoal text-cream' : 'bg-cream-dark text-charcoal-60 hover:bg-cream-hover'
          }`}
        >
          📍 Request Saya
          {requests && <span className={`py-[2px] px-[7px] rounded-full text-[9px] font-bold leading-[1.4] ${activeTab === 'requests' ? 'bg-gold text-white' : 'bg-charcoal-10 text-charcoal-60'}`}>{requests.length}</span>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full py-20 text-center text-charcoal-60 flex flex-col items-center">
            <svg className="animate-spin h-8 w-8 mb-4 text-sage" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Memuat data...
          </div>
        ) : currentData && currentData.length > 0 ? (
          currentData.map((item: any) => (
            <JastipCard 
              key={item.id}
              user={{ 
                name: item.user?.name || "Kamu", 
                avatarClass: activeTab === 'listings' ? "bg-gradient-to-br from-sage to-sage-dark" : "bg-gradient-to-br from-gold to-gold-dark", 
                avatarInitial: (item.user?.name || "K").charAt(0).toUpperCase(),
                wa_number: item.user?.wa_number 
              }}
              timeAgo={new Date(item.created_at || '').toLocaleDateString('id-ID')}
              status={item.status}
              route={{ from: item.from_loc, to: item.to_loc }}
              tags={[item.category ? `${item.category.icon || ''} ${item.category.name}`.trim() : "Umum"]}
              deadline={item.deadline ? new Date(item.deadline).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : undefined}
              notes={item.notes}
              imageUrl={item.primary_image_url}
              images={item.images}
              actionText="Lihat Detail"
              isOwner={true}
              onStatusChange={activeTab === 'listings' ? (newStatus) => handleStatusChange(item.id, newStatus) : undefined}
              onDelete={() => activeTab === 'listings' ? handleDeleteListing(item.id) : handleDeleteRequest(item.id)}
              onClick={() => navigate(`/jastip/${activeTab === 'listings' ? 'listings' : 'requests'}/${item.id}`)}
              onWhatsApp={(wa) => window.open(`https://wa.me/${wa}`, '_blank')}
            />
          ))
        ) : (
          <div className="col-span-full py-16 text-center border-2 border-dashed border-subtle rounded-2xl text-charcoal-60 bg-elevated">
            <div className="text-5xl mb-4">{activeTab === 'listings' ? '📦' : '📍'}</div>
            <h3 className="text-lg font-semibold text-charcoal mb-2">Belum Ada {activeTab === 'listings' ? 'Listing' : 'Request'}</h3>
            <p className="mb-6 text-[14px]">Kamu belum memiliki {activeTab === 'listings' ? 'jastip yang dibuka' : 'permintaan jastip'}.</p>
            <button
              onClick={() => navigate(activeTab === 'listings' ? '/jastip/listings/create' : '/jastip/requests/create')}
              className="btn btn-md btn-terra bg-terracotta text-white rounded-full font-body font-semibold px-6 py-3 text-[14px] hover:bg-terracotta-dark shadow-sm transition-all active:scale-[0.97]"
            >
              {activeTab === 'listings' ? '📦 Buka Jastip Baru' : '📍 Buat Request'}
            </button>
          </div>
        )}
      </div>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogConfig.title}</AlertDialogTitle>
            <AlertDialogDescription>{dialogConfig.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => { dialogConfig.action(); setDialogOpen(false); }} className="bg-terracotta hover:bg-terracotta-dark text-white">Ya, Lanjutkan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
