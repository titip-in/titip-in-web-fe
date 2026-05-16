import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCreateJastipListing, useJastipListingDetail, useUpdateJastipListing } from "@/hooks/useJastip";
import { useCategories } from "@/hooks/useCategory";
import { MultiImageUpload } from "@/components/ui/MultiImageUpload";
import { toast } from "sonner";

export default function JastipCreatePage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fromLoc, setFromLoc] = useState("");
  const [toLoc, setToLoc] = useState("");
  const [deadline, setDeadline] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [primaryImageUrl, setPrimaryImageUrl] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const createMutation = useCreateJastipListing();
  const updateMutation = useUpdateJastipListing(id || "");
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const { data: listingDetail, isLoading: isLoadingDetail } = useJastipListingDetail(id || "");

  useEffect(() => {
    if (isEdit && listingDetail) {
      setTitle(listingDetail.title || "");
      setDescription(listingDetail.description || "");
      setFromLoc(listingDetail.from_loc);
      setToLoc(listingDetail.to_loc);
      // Format datetime-local requires YYYY-MM-DDThh:mm
      if (listingDetail.deadline) {
        const d = new Date(listingDetail.deadline);
        const localDateString = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        setDeadline(localDateString);
      }
      setCategoryId(listingDetail.category_id || null);
      if (listingDetail.images) {
        setImageUrls(listingDetail.images.map(img => img.image_url));
      }
      setPrimaryImageUrl(listingDetail.primary_image_url);
    }
  }, [isEdit, listingDetail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        category_id: categoryId,
        title,
        description: description || null,
        from_loc: fromLoc,
        to_loc: toLoc,
        deadline: new Date(deadline).toISOString(),
        status: isEdit && listingDetail ? listingDetail.status : "ACTIVE",
        primary_image_url: primaryImageUrl || (imageUrls.length > 0 ? imageUrls[0] : null),
        images: imageUrls
      };

      if (isEdit) {
        await updateMutation.mutateAsync(payload);
        toast.success("Jastip berhasil diperbarui.");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Jastip berhasil dibuat.");
      }
      navigate('/jastip/mine');
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Gagal ${isEdit ? 'memperbarui' : 'membuat'} jastip.`);
    }
  };

  if (isEdit && isLoadingDetail) {
    return (
      <div className="flex justify-center py-20 text-charcoal-60">
        Memuat data jastip...
      </div>
    );
  }

  return (
    <div className="max-w-[600px] mx-auto py-8">
      <h1 className="font-display text-[32px] font-medium text-charcoal mb-2">{isEdit ? 'Edit Jastip' : 'Buka Jastip Baru'}</h1>
      <p className="text-[15px] text-charcoal-60 mb-8">Informasikan rute perjalananmu agar teman lain bisa menitip barang.</p>

      <form className="bg-elevated border border-subtle rounded-xl p-6 shadow-sm space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-charcoal-60 mb-3 block">Kategori Jastip</Label>
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
            <Label htmlFor="title" className="text-sm font-medium text-charcoal-60">Judul Jastip</Label>
            <Input
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
              placeholder="Contoh: Titip Makanan Suhat ke UB"
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-charcoal-60">Deskripsi (Opsional)</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 flex min-h-[80px] w-full rounded-md border border-subtle bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-charcoal-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Tuliskan detail barang yang bisa dititip..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="from_loc" className="text-sm font-medium text-charcoal-60">Berangkat Dari</Label>
              <Input
                id="from_loc"
                required
                value={fromLoc}
                onChange={(e) => setFromLoc(e.target.value)}
                className="mt-1"
                placeholder="Contoh: Suhat"
              />
            </div>
            <div>
              <Label htmlFor="to_loc" className="text-sm font-medium text-charcoal-60">Tujuan Ke</Label>
              <Input
                id="to_loc"
                required
                value={toLoc}
                onChange={(e) => setToLoc(e.target.value)}
                className="mt-1"
                placeholder="Contoh: Kampus UB"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="deadline" className="text-sm font-medium text-charcoal-60">Batas Nitip</Label>
            <Input
              id="deadline"
              type="datetime-local"
              required
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-charcoal-60 mb-4 block">Foto Tiket / Bukti Perjalanan (Opsional)</Label>
            <MultiImageUpload 
              value={imageUrls} 
              onChange={setImageUrls} 
              primaryImage={primaryImageUrl}
              onPrimaryImageChange={setPrimaryImageUrl}
              maxImages={5}
            />
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
            className="rounded-full bg-sage hover:bg-sage-dark text-white"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending ? "Menyimpan..." : (isEdit ? "Simpan Perubahan" : "Posting Jastip")}
          </Button>
        </div>
      </form>
    </div>
  );
}
