import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCreateJastipRequest } from "@/hooks/useJastip";
import { toast } from "sonner";

export default function JastipRequestCreatePage() {
  const [fromLoc, setFromLoc] = useState("");
  const [toLoc, setToLoc] = useState("");
  const [notes, setNotes] = useState("");
  
  const navigate = useNavigate();
  const createMutation = useCreateJastipRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        from_loc: fromLoc,
        to_loc: toLoc,
        notes: notes,
        status: "OPEN"
      });
      navigate('/jastip/requests');
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal membuat request jastip.");
    }
  };

  return (
    <div className="max-w-[600px] mx-auto py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-[32px] font-medium text-charcoal mb-2">Buat Request Jastip</h1>
        <p className="text-[15px] text-charcoal-60">Minta tolong teman lain untuk membawakan barang dari rute tertentu.</p>
      </div>

      <form className="bg-elevated border border-subtle rounded-xl p-6 shadow-sm space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="from_loc" className="text-sm font-medium text-charcoal-60">Barang dari Mana?</Label>
            <Input
              id="from_loc"
              required
              value={fromLoc}
              onChange={(e) => setFromLoc(e.target.value)}
              className="mt-1"
              placeholder="Contoh: Jakarta"
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
              placeholder="Contoh: Malang"
            />
          </div>
          <div>
            <Label htmlFor="notes" className="text-sm font-medium text-charcoal-60">Catatan Tambahan (Opsional)</Label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Contoh: Titip dokumen penting, harap hati-hati..."
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
