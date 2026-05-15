import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Pause, Play, Trash2 } from "lucide-react";
import { useJastipRequestDetail, useDeleteJastipRequest } from "@/hooks/useJastip";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useCategories } from "@/hooks/useCategory";
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

export default function JastipRequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const { data: item, isLoading } = useJastipRequestDetail(id || "");
  const { data: categories } = useCategories();
  const deleteMutation = useDeleteJastipRequest();

  const getCategoryName = () => {
    if (item?.category) return item.category.name;
    if (item?.category_id && categories) {
      const cat = categories.find(c => c.id === item.category_id);
      if (cat) return cat.name;
    }
    return "Umum";
  };

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const isOwner = user?.id === item?.user_id;

  const handleStatusChange = async (newStatus: string) => {
    try {
      await api.put(`/v1/jastip/requests/${id}`, { status: newStatus });
      queryClient.invalidateQueries({ queryKey: ['jastip'] });
      toast.success("Status berhasil diperbarui");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Gagal memperbarui status");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id || "");
      toast.success("Request berhasil dihapus");
      navigate('/jastip/requests');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Gagal menghapus request");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-[1100px] mx-auto py-20 text-center flex flex-col items-center">
        <svg className="animate-spin h-8 w-8 mb-4 text-sage" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-charcoal-60">Memuat detail request...</span>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-[1100px] mx-auto py-20 text-center">
        <h2 className="text-2xl font-medium text-charcoal">Request tidak ditemukan</h2>
        <Button onClick={() => navigate('/jastip/requests')} className="mt-4 rounded-full">Kembali ke List</Button>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-elevated border border-subtle rounded-2xl p-8 lg:p-12 shadow-sm">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="status-pill inline-flex items-center gap-1 py-1 px-3 rounded-full text-[10px] font-bold tracking-wide uppercase bg-gold-pale text-gold-dark mb-4">
                  {item.status === 'OPEN' ? 'Terbuka' : item.status === 'TAKEN' ? 'Diambil' : 'Ditutup'}
                </div>
                <div className="flex items-center gap-4 text-[32px] font-display font-medium text-charcoal">
                  <span>{item.from_loc}</span>
                  <svg className="w-8 h-8 text-charcoal-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                  <span>{item.to_loc}</span>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-semibold text-charcoal-40 uppercase tracking-wider mb-3">Catatan Request</h3>
                <div className="bg-cream-dark/30 rounded-xl p-6 italic text-charcoal-60 text-lg">
                  "{item.notes || 'Tidak ada catatan tambahan.'}"
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-charcoal-40 uppercase tracking-wider mb-2">Kategori</h3>
                  <p className="text-charcoal font-semibold text-lg">{getCategoryName()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-charcoal-40 uppercase tracking-wider mb-2">Dibuat Pada</h3>
                  <p className="text-charcoal font-semibold text-lg">{new Date(item.created_at || '').toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Management Panel for Owners */}
          {isOwner && (
            <div className="bg-charcoal text-cream rounded-2xl p-8 shadow-lg border border-charcoal">
              <h3 className="font-display text-xl mb-6 flex items-center gap-2">
                ⚙️ Kelola Request
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 mb-6">
                  <div className="text-xs text-cream/40 uppercase tracking-widest mb-1">Status Saat Ini</div>
                  <div className="font-bold text-lg text-gold">{item.status}</div>
                </div>
                
                {item.status === 'OPEN' ? (
                  <Button 
                    onClick={() => handleStatusChange('CLOSED')}
                    className="w-full bg-cream text-charcoal hover:bg-cream-hover rounded-full py-6 font-bold"
                  >
                    <span className="flex items-center gap-2"><Pause size={18} fill="currentColor" /> Tutup Request</span>
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleStatusChange('OPEN')}
                    className="w-full bg-sage text-white hover:bg-sage-dark rounded-full py-6 font-bold"
                  >
                    <span className="flex items-center gap-2"><Play size={18} fill="currentColor" /> Buka Kembali</span>
                  </Button>
                )}

                <Button 
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="w-full bg-transparent border border-red text-red hover:bg-red/10 rounded-full py-6 font-bold mt-2"
                >
                  <span className="flex items-center gap-2"><Trash2 size={18} /> Hapus Request</span>
                </Button>
              </div>
            </div>
          )}

          {/* User Info Panel */}
          <div className="bg-elevated border border-subtle rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-xl font-bold text-white shadow-sm">
                {(item.user?.name || "U").charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-base font-bold text-charcoal">{item.user?.name || "User"}</div>
                <div className="text-xs text-charcoal-40">Pembuat Request</div>
              </div>
            </div>

            {!isOwner && (
              <Button 
                onClick={() => window.open(`https://wa.me/${item.user?.wa_number}`, '_blank')}
                className="w-full bg-charcoal hover:bg-charcoal-80 text-white rounded-full py-6 text-base font-semibold gap-3"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                Chat Pembuat Request
              </Button>
            )}
            
            {isOwner && (
              <p className="text-center text-xs text-charcoal-40 italic">
                Ini adalah request Anda. Gunakan panel di atas untuk mengelola.
              </p>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Request?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Request Anda akan dihapus secara permanen dari Titip.in.
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
    </div>
  );
}
