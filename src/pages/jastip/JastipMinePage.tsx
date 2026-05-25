import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useMyJastipListings, useMyJastipRequests, useDeleteJastipListing, useDeleteJastipRequest } from "@/hooks/useJastip";
import { JastipCard } from "@/components/home/JastipCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
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
import { useJastipListingDetail, useJastipRequestDetail } from "@/hooks/useJastip";
import { useCategories } from "@/hooks/useCategory";
import { useActiveItemCount } from "@/hooks/useActiveItemCount";
import { useBoostItem } from "@/hooks/useBoost";
import { Input } from "@/components/ui/input";
import { makeWhatsAppUrl } from "@/lib/utils";

function JastipMineCardWrapper({ item, activeTab, onStatusChange, onDeleteListing, onDeleteRequest, onClick, onEdit, onBoost }: any) {
  // Fetch details to get missing relations (like images, user) that are not returned by the paginated /me endpoint
  const { data: listingDetail } = useJastipListingDetail(activeTab === 'listings' ? item.id : "");
  const { data: requestDetail } = useJastipRequestDetail(activeTab === 'requests' ? item.id : "");
  const { data: categories } = useCategories();

  const currentUser = useAuthStore((s) => s.user);

  const fullData = activeTab === 'listings' ? (listingDetail || item) : (requestDetail || item);

  const normalizeStatusForTab = (newStatus: string) => {
    if (activeTab === 'requests' && newStatus === 'ACTIVE') {
      return 'OPEN';
    }
    return newStatus;
  };

  const getCategoryTag = () => {
    if (fullData.category) {
      return `${fullData.category.icon || ''} ${fullData.category.name}`.trim();
    }
    if (fullData.category_id && categories) {
      const cat = categories.find(c => c.id === fullData.category_id);
      if (cat) return `${cat.icon || ''} ${cat.name}`.trim();
    }
    return "Umum";
  };

  return (
    <JastipCard 
      user={{ 
        name: fullData.user?.name || currentUser?.name || "Kamu", 
        avatarClass: activeTab === 'listings' ? "bg-gradient-to-br from-sage to-sage-dark" : "bg-gradient-to-br from-gold to-gold-dark", 
        avatarInitial: (fullData.user?.name || currentUser?.name || "K").charAt(0).toUpperCase(),
        avatar_url: fullData.user?.avatar_url || currentUser?.avatar_url,
        wa_number: fullData.user?.wa_number || currentUser?.wa_number 
      }}
      timeAgo={new Date(fullData.created_at || '').toLocaleDateString('id-ID')}
      status={fullData.status}
      title={fullData.title}
      route={{ from: fullData.from_loc, to: fullData.to_loc }}
      tags={[getCategoryTag()]}
      deadline={fullData.deadline ? new Date(fullData.deadline).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : undefined}
      notes={fullData.notes}
      imageUrl={fullData.primary_image_url}
      images={fullData.images}
      actionText="Lihat Detail"
      isOwner={true}
      onStatusChange={(newStatus) => onStatusChange(fullData.id, normalizeStatusForTab(newStatus))}
      onEdit={onEdit}
      onDelete={() => activeTab === 'listings' ? onDeleteListing(fullData.id) : onDeleteRequest(fullData.id)}
      onBoost={() => onBoost(fullData.id, activeTab)}
      onClick={onClick}
      hideImage={activeTab === 'requests'}
      onWhatsApp={(wa) => {
        const message = activeTab === 'listings'
          ? `Halo ${fullData.user?.name || ''}, aku tertarik dengan jastip mu dari ${fullData.from_loc} ke ${fullData.to_loc} untuk item '${fullData.title}' di Titip.in.`
          : `Halo ${fullData.user?.name || ''}, saya melihat request jastip Anda dari ${fullData.from_loc} ke ${fullData.to_loc} untuk item '${fullData.title}' di Titip.in. Saya bisa membantu membelikannya.`;
        window.open(makeWhatsAppUrl(wa, message), '_blank');
      }}
      userTier={currentUser?.tier}
      boostedAt={fullData.boosted_at}
      boostQuota={currentUser?.boost_quota}
    />
  );
}

export default function JastipMinePage() {
  const currentUser = useAuthStore((s) => s.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<"listings" | "requests">((searchParams.get("tab") as "listings" | "requests") || "listings");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "listings" || tab === "requests") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: "listings" | "requests") => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const { data: listings, isLoading: loadingListings } = useMyJastipListings();
  const { data: requests, isLoading: loadingRequests } = useMyJastipRequests();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isJastipListingLimitReached, isJastipRequestLimitReached, ACTIVE_LIMIT, jastipListingActiveCount, jastipRequestActiveCount } = useActiveItemCount();

  const deleteListing = useDeleteJastipListing();
  const deleteRequest = useDeleteJastipRequest();
  const boostItem = useBoostItem();

  const isLoading = activeTab === "listings" ? loadingListings : loadingRequests;
  const currentData = activeTab === "listings" ? listings : requests;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<{title: string, description: string, action: () => Promise<void> | void}>({
    title: "",
    description: "",
    action: () => {}
  });

  // Limit reached dialog
  const [limitDialogOpen, setLimitDialogOpen] = useState(false);
  const [limitDialogType, setLimitDialogType] = useState<"listings" | "requests">("listings");

  // Reopen listing dialog (requires new deadline)
  const [reopenDialogOpen, setReopenDialogOpen] = useState(false);
  const [reopenListingId, setReopenListingId] = useState<string | null>(null);
  const [reopenDeadline, setReopenDeadline] = useState("");

  const handleCreateClick = (type: "listings" | "requests") => {
    const isLimited = type === "listings" ? isJastipListingLimitReached : isJastipRequestLimitReached;
    if (isLimited) {
      setLimitDialogType(type);
      setLimitDialogOpen(true);
      return;
    }
    navigate(type === 'listings' ? '/jastip/listings/create' : '/jastip/requests/create');
  };

  const confirmAction = (title: string, description: string, action: () => Promise<void> | void) => {
    setDialogConfig({ title, description, action });
    setDialogOpen(true);
  };

  const handleBoost = (id: string, tab: string) => {
    // Gate: basic tier has no boost at all, others check remaining quota
    if (!currentUser?.tier || currentUser.tier === 'basic') {
      confirmAction(
        "⚡ Upgrade untuk Boost",
        "Fitur Boost hanya tersedia untuk pengguna Titip Plus dan Pro. Upgrade sekarang untuk memprioritaskan listing kamu di halaman utama dan meningkatkan visibilitas.",
        async () => {}
      );
      return;
    }

    if ((currentUser?.boost_quota ?? 0) <= 0) {
      confirmAction(
        "Kuota Boost Habis",
        `Kuota boost kamu bulan ini sudah habis. Kamu bisa upgrade ke plan yang lebih tinggi untuk mendapatkan lebih banyak kuota boost, atau tunggu sampai awal bulan depan ketika kuota direset secara otomatis.`,
        async () => {}
      );
      return;
    }

    const targetItem = activeTab === 'listings' ? listings?.find(l => l.id === id) : requests?.find(r => r.id === id);
    
    const executeBoost = () => {
      boostItem.mutate({
        type: tab === 'listings' ? 'jastip_listing' : 'jastip_request',
        id
      });
    };

    if (targetItem?.boosted_at) {
      confirmAction(
        "Boost Ulang Item?",
        "Item ini sudah dipromosikan. Melakukan boost lagi akan memotong 1 kuota untuk menaikkan posisi item ini ke paling atas. Lanjutkan?",
        executeBoost
      );
    } else {
      confirmAction(
        "Promosikan Item ini?",
        `Ingin menggunakan 1 kuota Boost untuk mempromosikan item ini? Tindakan ini akan menaikkan posisi item ini ke paling atas di halaman utama agar lebih mudah dilihat pembeli. Sisa kuota Anda: ${currentUser.boost_quota || 0}.`,
        executeBoost
      );
    }
  };


  const handleStatusChange = (id: string, newStatus: string) => {
    const isReopening = activeTab === 'listings' ? newStatus === 'ACTIVE' : newStatus === 'OPEN';

    // When re-opening a CLOSED listing, require a new deadline AND check limit
    if (isReopening) {
      const isLimited = activeTab === 'listings' ? isJastipListingLimitReached : isJastipRequestLimitReached;
      if (isLimited) {
        setLimitDialogType(activeTab);
        setLimitDialogOpen(true);
        return;
      }

      if (activeTab === 'listings') {
        const listing = listings?.find(l => l.id === id);
        if (listing?.status === 'CLOSED') {
          // Pre-fill with current deadline if available
          if (listing.deadline) {
            const d = new Date(listing.deadline);
            const offset = d.getTimezoneOffset() * 60000;
            setReopenDeadline(new Date(d.getTime() - offset).toISOString().slice(0, 16));
          } else {
            setReopenDeadline("");
          }
          setReopenListingId(id);
          setReopenDialogOpen(true);
          return;
        }
      }
    }

    const getLabel = (s: string) => {
      if (s === 'OPEN') return 'Terbuka';
      if (s === 'CLOSED') return 'Ditutup';
      if (s === 'TAKEN') return 'Diambil';
      return 'Aktif';
    };

    const targetItem = activeTab === 'listings' ? listings?.find(l => l.id === id) : requests?.find(r => r.id === id);
    const isLosingBoost = targetItem?.boosted_at && (newStatus === 'CLOSED' || newStatus === 'TAKEN');

    confirmAction(
      "Konfirmasi Ubah Status",
      isLosingBoost 
        ? `Item ini sedang dipromosikan (boosted). Mengubah status menjadi ${getLabel(newStatus)} akan menghapus promosinya dan kuota tidak akan dikembalikan. Lanjutkan?`
        : `Ubah status menjadi ${getLabel(newStatus)}?`,
      async () => {
        try {
          const endpoint = activeTab === 'listings' ? `/v1/jastip/listings/${id}` : `/v1/jastip/requests/${id}`;
          await api.put(endpoint, { status: newStatus });
          queryClient.invalidateQueries({ queryKey: ['jastip'] });
          toast.success("Status berhasil diubah.");
        } catch (err: any) {
          toast.error(err?.response?.data?.message || "Gagal mengubah status.");
        }
      }
    );
  };

  const handleReopenConfirm = async () => {
    if (!reopenListingId || !reopenDeadline) {
      toast.error("Harap isi Batas Nitip terlebih dahulu.");
      return;
    }
    try {
      await api.put(`/v1/jastip/listings/${reopenListingId}`, {
        status: 'ACTIVE',
        deadline: new Date(reopenDeadline).toISOString(),
      });
      queryClient.invalidateQueries({ queryKey: ['jastip'] });
      toast.success("Listing berhasil diaktifkan kembali.");
      setReopenDialogOpen(false);
      setReopenListingId(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Gagal mengaktifkan listing.");
    }
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

      {/* Tabs & Create CTA */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <button 
            onClick={() => handleTabChange("listings")}
            className={`rounded-full py-2 px-5 text-[12px] font-semibold tracking-[0.3px] transition-all duration-100 flex items-center gap-2 ${
              activeTab === 'listings' ? 'bg-charcoal text-cream' : 'bg-cream-dark text-charcoal-60 hover:bg-cream-hover'
            }`}
          >
            📋 Listing Saya
            {listings && <span className={`py-[2px] px-[7px] rounded-full text-[9px] font-bold leading-[1.4] ${activeTab === 'listings' ? 'bg-terracotta text-white' : 'bg-charcoal-10 text-charcoal-60'}`}>{listings.length}</span>}
          </button>
          <button 
            onClick={() => handleTabChange("requests")}
            className={`rounded-full py-2 px-5 text-[12px] font-semibold tracking-[0.3px] transition-all duration-100 flex items-center gap-2 ${
              activeTab === 'requests' ? 'bg-charcoal text-cream' : 'bg-cream-dark text-charcoal-60 hover:bg-cream-hover'
            }`}
          >
            📍 Request Saya
            {requests && <span className={`py-[2px] px-[7px] rounded-full text-[9px] font-bold leading-[1.4] ${activeTab === 'requests' ? 'bg-gold text-white' : 'bg-charcoal-10 text-charcoal-60'}`}>{requests.length}</span>}
          </button>
        </div>

        <button 
          onClick={() => handleCreateClick(activeTab)}
          className="btn btn-sm btn-terra bg-terracotta text-white rounded-full font-body font-semibold px-5 py-2 text-[12px] hover:bg-terracotta-dark shadow-sm transition-all active:scale-[0.97] flex items-center gap-1.5"
        >
          <Plus size={16} />
          {activeTab === 'listings' ? 'Buka Jastip' : 'Buat Request'}
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
            <JastipMineCardWrapper 
              key={item.id}
              item={item}
              activeTab={activeTab}
              onStatusChange={handleStatusChange}
              onDeleteListing={handleDeleteListing}
              onDeleteRequest={handleDeleteRequest}
              onBoost={handleBoost}
              onClick={() => navigate(`/jastip/${activeTab === 'listings' ? 'listings' : 'requests'}/${item.id}`)}
              onEdit={() => navigate(`/jastip/${activeTab === 'listings' ? 'listings' : 'requests'}/edit/${item.id}`)}
            />
          ))
        ) : (
          <div className="col-span-full py-16 text-center border-2 border-dashed border-subtle rounded-2xl text-charcoal-60 bg-elevated">
            <div className="text-5xl mb-4">{activeTab === 'listings' ? '📦' : '📍'}</div>
            <h3 className="text-lg font-semibold text-charcoal mb-2">Belum Ada {activeTab === 'listings' ? 'Listing' : 'Request'}</h3>
            <p className="mb-6 text-[14px]">Kamu belum memiliki {activeTab === 'listings' ? 'jastip yang dibuka' : 'permintaan jastip'}.</p>
            <button
              onClick={() => handleCreateClick(activeTab)}
              className="btn btn-md btn-terra bg-terracotta text-white rounded-full font-body font-semibold px-6 py-3 text-[14px] hover:bg-terracotta-dark shadow-sm transition-all active:scale-[0.97]"
            >
              {activeTab === 'listings' ? '📦 Buka Jastip Baru' : '📍 Buat Request'}
            </button>
          </div>
        )}
      </div>

      {/* Confirm dialog */}
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

      {/* Limit reached dialog */}
      <AlertDialog open={limitDialogOpen} onOpenChange={setLimitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="text-4xl mb-2 text-center">🚫</div>
            <AlertDialogTitle className="text-center">Batas Aktif Tercapai</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Kamu sudah memiliki <strong>{limitDialogType === 'listings' ? jastipListingActiveCount : jastipRequestActiveCount}/{ACTIVE_LIMIT}</strong> {limitDialogType === 'listings' ? 'jastip listing' : 'jastip request'} aktif.
              <br/><br/>Tutup atau hapus salah satu yang sudah tidak aktif sebelum membuat yang baru.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setLimitDialogOpen(false)} className="bg-charcoal hover:bg-charcoal-80 text-white w-full">Oke, Mengerti</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reopen listing with new deadline dialog */}
      <AlertDialog open={reopenDialogOpen} onOpenChange={setReopenDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Aktifkan Kembali Listing?</AlertDialogTitle>
            <AlertDialogDescription>
              Untuk mengaktifkan kembali listing ini, kamu perlu mengatur <strong>Batas Nitip</strong> baru agar penitip tahu sampai kapan kamu menerima titipan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="px-6 py-2">
            <label className="text-sm font-medium text-charcoal-60 block mb-1">Batas Nitip (Baru)</label>
            <Input
              type="datetime-local"
              value={reopenDeadline}
              onChange={(e) => setReopenDeadline(e.target.value)}
              className="w-full"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReopenConfirm}
              className="bg-sage hover:bg-sage-dark text-white"
              disabled={!reopenDeadline}
            >
              Aktifkan Kembali
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
