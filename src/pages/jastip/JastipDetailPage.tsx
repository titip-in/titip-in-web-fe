import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Pause, Play, Trash2, ShieldCheck, Flame } from "lucide-react";
import { useJastipListingDetail } from "@/hooks/useJastip";
import { Button } from "@/components/ui/button";
import { DetailImageGallery } from "@/components/ui/DetailImageGallery";
import { useAuthStore } from "@/stores/authStore";
import { useDeleteJastipListing } from "@/hooks/useJastip";
import { useBoostItem } from "@/hooks/useBoost";
import { toast } from "sonner";
import api from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useCategories } from "@/hooks/useCategory";
import { makeWhatsAppUrl } from "@/lib/utils";
import { useClickItem } from "@/hooks/useAnalytics";
import { TierBadge } from "@/components/ui/TierBadge";
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

export default function JastipDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const clickMutation = useClickItem();
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((s) => s.user);
  const { data: item, isLoading } = useJastipListingDetail(id || "");
  const { data: categories } = useCategories();
  const deleteMutation = useDeleteJastipListing();

  const getCategoryTag = () => {
    if (item?.category) return `${item.category.icon || ''} ${item.category.name}`.trim();
    if (item?.category_id && categories) {
      const cat = categories.find(c => c.id === item.category_id);
      if (cat) return `${cat.icon || ''} ${cat.name}`.trim();
    }
    return "Umum";
  };

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogConfig, setDialogConfig] = React.useState<{title: string, description: string, action: () => Promise<void> | void}>({
    title: "",
    description: "",
    action: () => {}
  });

  const confirmAction = (title: string, description: string, action: () => Promise<void> | void) => {
    setDialogConfig({ title, description, action });
    setDialogOpen(true);
  };

  const isOwner = currentUser?.id === item?.user_id;
  const boostItem = useBoostItem();

  const handleBoost = () => {
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

    const executeBoost = () => {
      boostItem.mutate({
        type: 'jastip_listing',
        id: id || ''
      });
    };

    if (item?.boosted_at) {
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

  const handleStatusChange = async (newStatus: string) => {
    try {
      await api.put(`/v1/jastip/listings/${id}`, { status: newStatus });
      queryClient.invalidateQueries({ queryKey: ['jastip'] });
      toast.success("Status berhasil diperbarui");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Gagal memperbarui status");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id || "");
      toast.success("Listing berhasil dihapus");
      navigate('/jastip/listings');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Gagal menghapus listing");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-[1100px] mx-auto py-20 text-center flex flex-col items-center">
        <svg className="animate-spin h-8 w-8 mb-4 text-sage" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-charcoal-60">Memuat detail jastip...</span>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-[1100px] mx-auto py-20 text-center">
        <h2 className="text-2xl font-medium text-charcoal">Jastip tidak ditemukan</h2>
        <Button onClick={() => navigate('/jastip')} className="mt-4 rounded-full">Kembali ke Katalog</Button>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto py-8 animate-fade-in">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-charcoal-40 hover:text-charcoal mb-6 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Kembali
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-elevated border border-subtle rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-cream-dark aspect-square lg:aspect-auto h-[400px] lg:h-[600px] overflow-hidden">
            <DetailImageGallery 
              images={item.images || []} 
              alt="Tiket Jastip" 
            />
          </div>
  
          <div className="p-8 lg:p-12 flex flex-col">
            <div className="flex justify-between items-start mb-8">
              <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <div className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[12px] font-bold tracking-wide uppercase ${item.status === 'ACTIVE' ? 'bg-sage text-white' : 'bg-charcoal-20 text-charcoal-60'}`}>
                  <div className="w-[6px] h-[6px] rounded-full bg-current"></div>
                  {item.status === 'ACTIVE' ? 'Aktif' : item.status === 'CLOSED' ? 'Ditutup' : item.status}
                </div>
                {item.boosted_at && (
                  <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[12px] font-bold tracking-wide uppercase bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm">
                    <Flame size={14} fill="currentColor" />
                    Dipromosikan
                  </div>
                )}
              </div>
                <h1 className="text-[32px] font-display font-medium text-charcoal mb-2">{item.title}</h1>
                <div className="flex items-center gap-3 text-[18px] font-medium text-charcoal-60">
                  <span>{item.from_loc}</span>
                  <svg className="w-5 h-5 text-charcoal-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                  <span>{item.to_loc}</span>
                </div>
              </div>
            </div>
  
            <div className="space-y-8 flex-grow">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-charcoal-40 uppercase tracking-wider mb-2">Batas Nitip</h3>
                  <p className="text-charcoal font-semibold text-lg">
                    {new Date(item.deadline).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-charcoal-40 uppercase tracking-wider mb-2">Kategori</h3>
                  <p className="text-charcoal font-semibold text-lg">{getCategoryTag()}</p>
                </div>
              </div>

              {item.description && (
                <div className="mt-8 pt-8 border-t border-subtle">
                  <h3 className="text-sm font-semibold text-charcoal-40 uppercase tracking-wider mb-4">Deskripsi</h3>
                  <p className="text-charcoal-60 leading-relaxed whitespace-pre-wrap">{item.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Management Panel for Owners */}
          {isOwner && (
            <div className="bg-charcoal text-cream rounded-2xl p-8 shadow-lg border border-charcoal">
              <h3 className="font-display text-xl mb-6 flex items-center gap-2">
                ⚙️ Kelola Listing
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 mb-6">
                  <div className="text-xs text-cream/40 uppercase tracking-widest mb-1">Status Saat Ini</div>
                  <div className="font-bold text-lg text-sage">{item.status}</div>
                </div>
                
                <Button 
                  onClick={() => handleStatusChange(item.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE')}
                  className={`w-full rounded-full py-6 font-bold ${
                    item.status === 'ACTIVE' ? 'bg-cream text-charcoal hover:bg-cream-hover' : 'bg-sage text-white hover:bg-sage-dark'
                  }`}
                >
                  {item.status === 'ACTIVE' ? (
                    <span className="flex items-center gap-2"><Pause size={18} fill="currentColor" /> Tutup Listing</span>
                  ) : (
                    <span className="flex items-center gap-2"><Play size={18} fill="currentColor" /> Buka Kembali</span>
                  )}
                </Button>
                <Button 
                  onClick={handleBoost}
                  disabled={boostItem.isPending}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-full py-6 font-bold mt-2"
                >
                  <span className="flex items-center gap-2">
                    <Flame size={18} fill="currentColor" /> 
                    {boostItem.isPending ? "Memproses..." : item.boosted_at ? "Boost Ulang Listing" : "Boost Listing"}
                  </span>
                </Button>

                <Button 
                  onClick={() => navigate(`/jastip/listings/edit/${id}`)}
                  className="w-full bg-cream/10 border border-white/20 text-cream hover:bg-white/10 rounded-full py-6 font-bold mt-2"
                >
                  <span className="flex items-center gap-2">✏️ Edit Detail Listing</span>
                </Button>

                <Button 
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="w-full bg-transparent border border-red text-red hover:bg-red/10 rounded-full py-6 font-bold mt-2"
                >
                  <span className="flex items-center gap-2"><Trash2 size={18} /> Hapus Listing</span>
                </Button>
              </div>
            </div>
          )}

          {/* User Info Panel */}
          <div className="bg-elevated border border-subtle rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-sage to-sage-dark flex items-center justify-center text-lg font-bold text-white border border-subtle">
                {item.user?.avatar_url ? (
                  <img src={item.user.avatar_url} alt={item.user.name} className="w-full h-full object-cover" />
                ) : (
                  (item.user?.name || "U").charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <div className="text-sm font-semibold text-charcoal flex items-center gap-1.5 flex-wrap">
                  {item.user?.name || "User"}
                  {item.user?.tier && <TierBadge tier={item.user.tier} size="xs" />}
                  {item.user?.wa_verified_at && (
                    <span className="flex items-center text-sage text-[10px] font-bold px-1.5 py-0.5 rounded bg-sage-pale leading-none" title="Nomor WhatsApp Terverifikasi">
                      <ShieldCheck size={10} className="mr-0.5" /> WA Verified
                    </span>
                  )}
                </div>
                <div className="text-[12px] text-charcoal-60 font-medium px-2 py-0.5 bg-charcoal-10 rounded-md inline-block mt-1">
                  {item.user?.status || "Member Titip.in"}
                </div>
              </div>
            </div>

            {!isOwner ? (
              <Button 
                onClick={() => {
                  clickMutation.mutate({ type: 'jastip_listing', id: item.id });
                  const message = `Halo ${item.user?.name || ''}, aku tertarik dengan jastip mu dari ${item.from_loc} ke ${item.to_loc} untuk item '${item.title}' di Titip.in.`;
                  window.open(makeWhatsAppUrl(item.user?.wa_number || '', message), '_blank');
                }}
                className="w-full bg-charcoal hover:bg-charcoal-80 text-white rounded-full py-6 text-lg font-semibold gap-3"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                Chat Penitip Sekarang
              </Button>
            ) : (
              <p className="text-center text-[13px] text-charcoal-40 italic">
                Ini adalah listing Anda. Gunakan panel di atas untuk mengelola.
              </p>
            )}
          </div>

          {/* Safety Panel */}
          <div className="bg-sage-pale/40 border border-sage/20 rounded-2xl p-6">
            <h4 className="font-semibold text-sage-dark text-sm mb-3 flex items-center gap-2">
              <span className="text-lg">🛡️</span> Tips Keamanan
            </h4>
            <ul className="space-y-3">
              <li className="text-[12px] text-sage-dark/80 flex gap-2">
                <span className="font-bold">•</span>
                Gunakan fitur Chat WhatsApp untuk diskusi detail barang.
              </li>
              <li className="text-[12px] text-sage-dark/80 flex gap-2">
                <span className="font-bold">•</span>
                Lakukan pembayaran secara aman (COD di kampus sangat disarankan).
              </li>
              <li className="text-[12px] text-sage-dark/80 flex gap-2">
                <span className="font-bold">•</span>
                Selalu cek kondisi barang saat bertemu secara langsung.
              </li>
            </ul>
          </div>

          {/* Promo/Help Panel */}
          <div className="bg-gradient-to-br from-terracotta/10 to-gold/10 border border-terracotta/10 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-terracotta/5 rounded-full blur-xl"></div>
            <h4 className="font-semibold text-terracotta text-sm mb-2">Butuh Bantuan?</h4>
            <p className="text-[12px] text-charcoal-60 mb-4">Punya kendala dengan listing ini? Hubungi tim support Titip.in.</p>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => window.open('https://wa.me/6285750583867', '_blank')}
                className="text-[12px] font-bold text-terracotta hover:underline text-left flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                Chat via WhatsApp
              </button>
              <a 
                href="mailto:support@titipin.me"
                className="text-[12px] font-bold text-terracotta hover:underline flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                Email Support
              </a>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Listing?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Listing Anda akan dihapus secara permanen dari Titip.in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red hover:bg-red/90 text-white">
              Ya, Hapus Permanen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogConfig.title}</AlertDialogTitle>
            <AlertDialogDescription>{dialogConfig.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={dialogConfig.action} className="bg-charcoal hover:bg-charcoal-80 text-white">
              Lanjutkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
