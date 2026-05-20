import React, { useState } from "react";
import { useAdminItems, AdminItemType, useAdminForceDelete } from "@/hooks/useAdmin";
import { Package, Trash2, Flame } from "lucide-react";
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

export default function AdminItemsPage() {
  const [activeTab, setActiveTab] = useState<AdminItemType>("jastip_listing");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useAdminItems(activeTab, page);
  const forceDelete = useAdminForceDelete();

  const handleTabChange = (tab: AdminItemType) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      forceDelete.mutate({ type: activeTab, id: deleteId });
      setDeleteId(null);
    }
  };

  const tabs: { value: AdminItemType; label: string }[] = [
    { value: "jastip_listing", label: "Jastip Listing" },
    { value: "jastip_request", label: "Jastip Request" },
    { value: "preloved_listing", label: "Preloved Listing" },
    { value: "preloved_request", label: "Preloved Request" },
  ];

  // Robust parsing: Backend might return flat array directly, or PaginatedData object
  const items = Array.isArray(data) ? data : (data?.data || []);
  const isBackendPaginated = data && !Array.isArray(data) && 'last_page' in data;

  const itemsPerPage = 10;
  const paginatedItems = isBackendPaginated 
    ? items 
    : items.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const totalPages = isBackendPaginated 
    ? (data as any).last_page 
    : Math.ceil(items.length / itemsPerPage);

  const fromVal = isBackendPaginated 
    ? (data as any).from 
    : (items.length > 0 ? (page - 1) * itemsPerPage + 1 : 0);

  const toVal = isBackendPaginated 
    ? (data as any).to 
    : Math.min(page * itemsPerPage, items.length);

  const totalVal = isBackendPaginated 
    ? (data as any).total 
    : items.length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-charcoal flex items-center gap-2">
          <Package size={24} className="text-terracotta" /> 
          Manajemen Item
        </h1>
        <p className="text-charcoal-60 text-sm mt-1">Pantau dan hapus listing/request yang melanggar aturan.</p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab.value
                ? "bg-charcoal text-cream"
                : "bg-charcoal-10 text-charcoal-60 hover:bg-charcoal-20"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-charcoal-10 text-charcoal-60 font-medium">
              <tr>
                <th className="px-4 py-3">ID / Title</th>
                <th className="px-4 py-3">User (Owner)</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Dibuat</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-subtle">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-charcoal-50">Memuat data...</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-charcoal-50">Tidak ada item ditemukan.</td>
                </tr>
              ) : (
                paginatedItems.map((item: any) => (
                  <tr key={item.id} className="hover:bg-charcoal-10/50 transition-colors">
                    <td className="px-4 py-3 max-w-[200px]">
                      <div className="font-semibold text-charcoal truncate" title={item.title}>{item.title}</div>
                      <div className="text-[10px] text-charcoal-40 truncate">{item.id}</div>
                      {item.boosted_at && (
                        <div className="inline-flex items-center gap-0.5 mt-1 text-[9px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-bold uppercase">
                          <Flame size={10} /> Boosted
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-charcoal-80 font-medium">{item.user?.name || `User ID: ${item.user_id}`}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-charcoal-10 text-charcoal-80 px-2 py-0.5 rounded text-xs font-semibold uppercase">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-charcoal-60">
                      {new Date(item.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDeleteClick(item.id)}
                        className="p-2 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        title="Force Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-subtle flex justify-between items-center bg-charcoal-10/30">
            <span className="text-xs text-charcoal-60">
              Menampilkan {fromVal}-{toVal} dari {totalVal} item
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
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-2 py-1 text-xs font-medium rounded border border-subtle bg-white disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* AlertDialog Confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-cream border-cream-dark rounded-2xl max-w-[400px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-charcoal">Hapus Paksa Item?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-charcoal-60">
              Apakah Anda yakin ingin menghapus item ini secara paksa? Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full border-charcoal-30 hover:bg-charcoal-10 text-charcoal w-full sm:w-auto">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
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
