import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCreatePrelovedListing } from "@/hooks/usePreloved";
import { MultiImageUpload } from "@/components/ui/MultiImageUpload";
import { toast } from "sonner";

export default function PrelovedCreatePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState<"NEW" | "LIKE_NEW" | "GOOD" | "FAIR">("GOOD");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  
  const navigate = useNavigate();
  const createMutation = useCreatePrelovedListing();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        title,
        description,
        price: parseInt(price, 10),
        condition,
        status: "AVAILABLE",
        image_url: imageUrls.length > 0 ? imageUrls.join(',') : null
      });
      navigate('/preloved/listings');
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal membuat listing preloved.");
    }
  };

  return (
    <div className="max-w-[600px] mx-auto py-8">
      <h1 className="font-display text-[32px] font-medium text-charcoal mb-2">Jual Barang Preloved</h1>
      <p className="text-[15px] text-charcoal-60 mb-8">Jual barang bekasmu yang masih layak pakai ke teman-teman kampus.</p>

      <form className="bg-elevated border border-subtle rounded-xl p-6 shadow-sm space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-charcoal-60">Nama Barang</Label>
            <Input
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
              placeholder="Contoh: Sepatu Converse Size 40"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-charcoal-60 mb-4 block">Foto Barang</Label>
            <MultiImageUpload 
              value={imageUrls} 
              onChange={setImageUrls} 
              maxImages={5}
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-charcoal-60">Deskripsi</Label>
            <textarea
              id="description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Deskripsikan barangmu secara detail..."
            />
          </div>
          <div>
            <Label htmlFor="price" className="text-sm font-medium text-charcoal-60">Harga (Rp)</Label>
            <Input
              id="price"
              type="number"
              required
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1"
              placeholder="Contoh: 150000"
            />
          </div>
          <div>
            <Label htmlFor="condition" className="text-sm font-medium text-charcoal-60">Kondisi</Label>
            <select
              id="condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value as any)}
              className="mt-1 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="NEW">Baru (New)</option>
              <option value="LIKE_NEW">Seperti Baru (Like New)</option>
              <option value="GOOD">Bagus (Good)</option>
              <option value="FAIR">Cukup (Fair)</option>
            </select>
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
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Menyimpan..." : "Posting Barang"}
          </Button>
        </div>
      </form>
    </div>
  );
}
