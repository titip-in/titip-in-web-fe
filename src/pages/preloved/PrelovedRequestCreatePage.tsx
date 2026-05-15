import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCreatePrelovedRequest } from "@/hooks/usePreloved";
import { useCategories } from "@/hooks/useCategory";
import { toast } from "sonner";

export default function PrelovedRequestCreatePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  
  const navigate = useNavigate();
  const createMutation = useCreatePrelovedRequest();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        category_id: categoryId,
        title: title,
        description: description,
        max_price: parseInt(maxPrice, 10),
        status: "OPEN"
      });
      navigate('/preloved/requests');
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal membuat request preloved.");
    }
  };

  return (
    <div className="max-w-[600px] mx-auto py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-[32px] font-medium text-charcoal mb-2">Cari Barang Preloved</h1>
        <p className="text-[15px] text-charcoal-60">Beritahu orang lain barang apa yang sedang kamu cari.</p>
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
            <Label htmlFor="title" className="text-sm font-medium text-charcoal-60">Nama Barang yang Dicari</Label>
            <Input
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
              placeholder="Contoh: Buku Kalkulus Purcell"
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-charcoal-60">Deskripsi Singkat</Label>
            <textarea
              id="description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Jelaskan kondisi atau spesifikasi yang kamu inginkan..."
            />
          </div>
          <div>
            <Label htmlFor="maxPrice" className="text-sm font-medium text-charcoal-60">Budget Maksimal (Rp)</Label>
            <Input
              id="maxPrice"
              type="number"
              required
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="mt-1"
              placeholder="Contoh: 50000"
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
            className="rounded-full bg-charcoal hover:bg-charcoal-80 text-white"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Mengirim..." : "Posting Request"}
          </Button>
        </div>
      </form>
    </div>
  );
}
