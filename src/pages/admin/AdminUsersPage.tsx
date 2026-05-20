import React, { useState } from "react";
import { useAdminUsers, useUpdateUserTier, useToggleBanUser, useDeleteAdminUser } from "@/hooks/useAdmin";
import { Search, UserCheck, UserX, Shield, AlertTriangle, Trash2 } from "lucide-react";
import { UserTier } from "@/types/api";
import { TierBadge } from "@/components/ui/TierBadge";
import { Input } from "@/components/ui/input";
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

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Confirmation States
  const [confirmTier, setConfirmTier] = useState<{ id: number; tier: UserTier; name: string } | null>(null);
  const [confirmBan, setConfirmBan] = useState<{ id: number; name: string; isCurrentlyBanned: boolean } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null);

  const { data, isLoading } = useAdminUsers(page, debouncedSearch);
  const updateTier = useUpdateUserTier();
  const toggleBan = useToggleBanUser();
  const deleteUser = useDeleteAdminUser();

  // Debounce search
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset page on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleTierChange = (id: number, name: string, newTier: string) => {
    setConfirmTier({ id, tier: newTier as UserTier, name });
  };

  const handleBanToggle = (id: number, name: string, isCurrentlyBanned: boolean) => {
    setConfirmBan({ id, name, isCurrentlyBanned });
  };

  const handleDeleteUserClick = (id: number, name: string) => {
    setConfirmDelete({ id, name });
  };

  const executeTierChange = () => {
    if (confirmTier) {
      updateTier.mutate({ id: confirmTier.id, tier: confirmTier.tier });
      setConfirmTier(null);
    }
  };

  const executeBanToggle = () => {
    if (confirmBan) {
      toggleBan.mutate({ id: confirmBan.id, is_banned: !confirmBan.isCurrentlyBanned });
      setConfirmBan(null);
    }
  };

  const executeDeleteUser = () => {
    if (confirmDelete) {
      deleteUser.mutate(confirmDelete.id);
      setConfirmDelete(null);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal flex items-center gap-2">
            <Shield size={24} className="text-terracotta" /> 
            Manajemen Pengguna
          </h1>
          <p className="text-charcoal-60 text-sm mt-1">Kelola data pengguna, tier freemium, dan status larangan (ban).</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-40" />
          <Input 
            placeholder="Cari nama atau email..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-charcoal-10 text-charcoal-60 font-medium">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Kontak</th>
                <th className="px-4 py-3">Tier</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-subtle">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-charcoal-50">Memuat data...</td>
                </tr>
              ) : data?.data?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-charcoal-50">Tidak ada pengguna ditemukan.</td>
                </tr>
              ) : (
                data?.data?.map((user) => (
                  <tr key={user.id} className="hover:bg-charcoal-10/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-charcoal">{user.name}</div>
                      <div className="text-xs text-charcoal-40">ID: {user.id}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-charcoal-80">{user.email}</div>
                      <div className="text-xs text-charcoal-50">{user.wa_number || '-'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select 
                          value={user.tier || 'basic'}
                          onChange={(e) => handleTierChange(user.id, user.name, e.target.value)}
                          className={`text-xs font-bold rounded-full px-2 py-1 outline-none cursor-pointer border ${
                            user.tier === 'pro' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                            user.tier === 'plus' ? 'bg-violet-50 text-violet-600 border-violet-200' :
                            'bg-charcoal-10 text-charcoal-60 border-charcoal-20'
                          }`}
                        >
                          <option value="basic">Basic</option>
                          <option value="plus">Plus</option>
                          <option value="pro">Pro</option>
                        </select>
                        <TierBadge tier={user.tier || 'basic'} />
                      </div>
                      {user.boost_quota !== undefined && (
                        <div className="text-[10px] text-charcoal-40 mt-1">Quota: {user.boost_quota}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {user.is_banned ? (
                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-semibold">
                          <AlertTriangle size={12} /> Banned
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">
                          <UserCheck size={12} /> Aktif
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleBanToggle(user.id, user.name, user.is_banned)}
                          className={`p-2 rounded transition-colors ${
                            user.is_banned 
                              ? 'bg-charcoal-10 text-charcoal hover:bg-charcoal-20' 
                              : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                          }`}
                          title={user.is_banned ? "Cabut Ban" : "Ban Pengguna"}
                        >
                          {user.is_banned ? <UserCheck size={16} /> : <UserX size={16} />}
                        </button>
                        <button
                          onClick={() => handleDeleteUserClick(user.id, user.name)}
                          className="p-2 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Hapus Permanen"
                          disabled={deleteUser.isPending}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.last_page > 1 && (
          <div className="px-4 py-3 border-t border-subtle flex justify-between items-center bg-charcoal-10/30">
            <span className="text-xs text-charcoal-60">
              Menampilkan {data.from || 0}-{data.to || 0} dari {data.total} pengguna
            </span>
            <div className="flex gap-1">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-2 py-1 text-xs font-medium rounded border border-subtle bg-white disabled:opacity-50"
              >
                Prev
              </button>
              <button 
                onClick={() => setPage(p => Math.min(data.last_page, p + 1))}
                disabled={page === data.last_page}
                className="px-2 py-1 text-xs font-medium rounded border border-subtle bg-white disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* AlertDialog: Update Tier */}
      <AlertDialog open={confirmTier !== null} onOpenChange={(open) => !open && setConfirmTier(null)}>
        <AlertDialogContent className="bg-cream border-cream-dark rounded-2xl max-w-[400px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-charcoal">Ubah Tier Pengguna?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-charcoal-60">
              Ubah keanggotaan <strong>{confirmTier?.name}</strong> menjadi{" "}
              <strong className="text-terracotta">{confirmTier?.tier.toUpperCase()}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full border-charcoal-30 hover:bg-charcoal-10 text-charcoal w-full sm:w-auto">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={executeTierChange} 
              className="bg-charcoal text-white rounded-full w-full sm:w-auto"
            >
              Simpan Perubahan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* AlertDialog: Ban Toggle */}
      <AlertDialog open={confirmBan !== null} onOpenChange={(open) => !open && setConfirmBan(null)}>
        <AlertDialogContent className="bg-cream border-cream-dark rounded-2xl max-w-[400px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-charcoal">
              {confirmBan?.isCurrentlyBanned ? "Cabut Ban Pengguna?" : "Ban Pengguna?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-charcoal-60">
              Apakah Anda yakin ingin {confirmBan?.isCurrentlyBanned ? "mencabut status ban dari" : "menjatuhkan hukuman ban kepada"}{" "}
              <strong>{confirmBan?.name}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full border-charcoal-30 hover:bg-charcoal-10 text-charcoal w-full sm:w-auto">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={executeBanToggle} 
              className={`rounded-full w-full sm:w-auto text-white ${
                confirmBan?.isCurrentlyBanned ? "bg-emerald-600 hover:bg-emerald-700" : "bg-amber-600 hover:bg-amber-700"
              }`}
            >
              Ya, Lanjutkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* AlertDialog: Delete User */}
      <AlertDialog open={confirmDelete !== null} onOpenChange={(open) => !open && setConfirmDelete(null)}>
        <AlertDialogContent className="bg-cream border-cream-dark rounded-2xl max-w-[400px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-charcoal">Hapus Akun Pengguna?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-charcoal-60">
              Apakah Anda yakin ingin melakukan <strong className="text-red">FORCE DELETE</strong> pada akun <strong>{confirmDelete?.name}</strong>?
              <br />
              <span className="text-red font-bold text-xs mt-3 block p-2 bg-red/10 rounded-lg border border-red/20">
                ⚠️ PERINGATAN KERAS: Berbeda dengan hapus akun mandiri, tindakan ini akan menghapus akun secara permanen dari database. ID, Email, dan seluruh data terkait tidak akan bisa direstore.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full border-charcoal-30 hover:bg-charcoal-10 text-charcoal w-full sm:w-auto">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={executeDeleteUser} 
              className="bg-red-600 hover:bg-red-700 text-white rounded-full w-full sm:w-auto"
            >
              Hapus Permanen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
