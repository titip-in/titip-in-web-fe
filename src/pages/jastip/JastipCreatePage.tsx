import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCreateJastipListing } from "@/hooks/useJastip";
import { MultiImageUpload } from "@/components/ui/MultiImageUpload";
import { toast } from "sonner";

export default function JastipCreatePage() {
  const [fromLoc, setFromLoc] = useState("");
  const [toLoc, setToLoc] = useState("");
  const [deadline, setDeadline] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  
  const navigate = useNavigate();
  const createMutation = useCreateJastipListing();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        from_loc: fromLoc,
        to_loc: toLoc,
        deadline: new Date(deadline).toISOString(),
        status: "ACTIVE",
        image_url: imageUrls.length > 0 ? imageUrls.join(',') : null
      });
      navigate('/jastip/listings');
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal membuat jastip.");
    }
  };

  return (
    <div className="max-w-[600px] mx-auto py-8">
      <h1 className="font-display text-[32px] font-medium text-charcoal mb-2">Buka Jastip Baru</h1>
      <p className="text-[15px] text-charcoal-60 mb-8">Informasikan rute perjalananmu agar teman lain bisa menitip barang.</p>

      <form className="bg-elevated border border-subtle rounded-xl p-6 shadow-sm space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="from_loc" className="text-sm font-medium text-charcoal-60">Berangkat Dari</Label>
            <Input
              id="from_loc"
              required
              value={fromLoc}
              onChange={(e) => setFromLoc(e.target.value)}
              className="mt-1"
              placeholder="Contoh: Surabaya"
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
              placeholder="Contoh: Malang Raya"
            />
          </div>
          <div>
            <Label htmlFor="deadline" className="text-sm font-medium text-charcoal-60">Batas Waktu Titipan / Berangkat</Label>
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
              maxImages={3}
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
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Menyimpan..." : "Posting Jastip"}
          </Button>
        </div>
      </form>
    </div>
  );
}
