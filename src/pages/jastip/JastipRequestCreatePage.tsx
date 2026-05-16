import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCreateJastipRequest, useJastipRequestDetail, useUpdateJastipRequest } from "@/hooks/useJastip";
import { useCategories } from "@/hooks/useCategory";
import { toast } from "sonner";

export default function JastipRequestCreatePage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fromLoc, setFromLoc] = useState("");
  const [toLoc, setToLoc] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  
  const navigate = useNavigate();
  const createMutation = useCreateJastipRequest();
  const updateMutation = useUpdateJastipRequest(id || "");
  const { data: categories, isLoading: isLoadingCategories } = useCategories('jastip');
  const { data: requestDetail, isLoading: isLoadingDetail } = useJastipRequestDetail(id || "");

  useEffect(() => {
    if (isEdit && requestDetail) {
      setTitle(requestDetail.title || "");
      setDescription(requestDetail.description || "");
      setFromLoc(requestDetail.from_loc);
      setToLoc(requestDetail.to_loc);
      setCategoryId(requestDetail.category_id || null);
    }
  }, [isEdit, requestDetail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        category_id: categoryId,
        title,
        description: description || null,
        from_loc: fromLoc,
        to_loc: toLoc,
        status: isEdit && requestDetail ? requestDetail.status : "OPEN"
      };

      if (isEdit) {
        await updateMutation.mutateAsync(payload);
        toast.success("Request jastip berhasil diperbarui.");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Request jastip berhasil dibuat.");
      }
      navigate('/jastip/mine?tab=requests');
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Gagal ${isEdit ? 'memperbarui' : 'membuat'} request jastip.`);
    }
  };

  if (isEdit && isLoadingDetail) {
    return (
      <div className="flex justify-center py-20 text-charcoal-60">
        Memuat data request...
      </div>
    );
  }

  return (
    <div className="max-w-[600px] mx-auto py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-[32px] font-medium text-charcoal mb-2">{isEdit ? 'Edit Request Jastip' : 'Buat Request Jastip'}</h1>
        <p className="text-[15px] text-charcoal-60">{isEdit ? 'Perbarui informasi permintaan jastip kamu.' : 'Minta tolong teman lain untuk membawakan barang dari rute tertentu.'}</p>
      </div>

      <form className="bg-elevated border border-subtle rounded-xl p-6 shadow-sm space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-charcoal-60 mb-3 block">Kategori Request</Label>
            {isLoadingCategories ? (
              <div className="text-sm text-charcoal-40">Memuat kategori...</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {categories?.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                      categoryId === cat.id 
                        ? 'bg-sage text-white border-sage' 
                        : 'bg-white text-charcoal-60 border-subtle hover:border-sage/50 hover:bg-sage/5'
                    }`}
                  >
                    {cat.icon && <span className="mr-2">{cat.icon}</span>}
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-charcoal-60">Judul Request</Label>
            <Input
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
              placeholder="Contoh: Titip Beli Kopi"
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-charcoal-60">Deskripsi (Opsional)</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 flex min-h-[80px] w-full rounded-md border border-subtle bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-charcoal-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Tuliskan deskripsi lengkap barang yang kamu minta tolong belikan..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="from_loc" className="text-sm font-medium text-charcoal-60">Barang dari Mana?</Label>
              <Input
                id="from_loc"
                required
                value={fromLoc}
                onChange={(e) => setFromLoc(e.target.value)}
                className="mt-1"
                placeholder="Contoh: Sawojajar"
              />
            </div>
            <div>
              <Label htmlFor="to_loc" className="text-sm font-medium text-charcoal-60">Tujuan Pengiriman</Label>
              <Input
                id="to_loc"
                required
                value={toLoc}
                onChange={(e) => setToLoc(e.target.value)}
                className="mt-1"
                placeholder="Contoh: Dinoyo"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-subtle flex justify-end gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="rounded-full text-charcoal-60"
          >
            Batal
          </Button>
          <Button 
            type="submit" 
            className="rounded-full bg-charcoal hover:bg-charcoal-80 text-white"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending ? "Menyimpan..." : (isEdit ? "Simpan Perubahan" : "Posting Request")}
          </Button>
        </div>
      </form>
    </div>
  );
}
