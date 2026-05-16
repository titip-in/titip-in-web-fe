import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { useUpdateProfile } from "@/hooks/useProfile";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

interface SetupProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SetupProfileDialog({ isOpen, onClose }: SetupProfileDialogProps) {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const setAuth = useAuthStore((state) => state.setAuth);
  const updateMutation = useUpdateProfile();

  const [status, setStatus] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      const updatedUser = await updateMutation.mutateAsync({
        name: user?.name || "",
        wa_number: user?.wa_number || "",
        status: status || user?.status || null,
        avatar_url: avatarUrl || user?.avatar_url || null,
      });

      if (token) {
        setAuth(updatedUser, token);
      }
      toast.success("Profil berhasil diperbarui! Selamat bergabung di Titip.in.");
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal memperbarui profil.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-cream border-cream-dark p-0 overflow-hidden rounded-2xl">
        <div className="h-2 bg-gradient-to-r from-sage via-terracotta to-gold"></div>
        <div className="p-8">
          <DialogHeader className="mb-6">
            <div className="w-12 h-12 bg-sage-pale rounded-2xl flex items-center justify-center text-sage mb-4 animate-bounce">
              <Sparkles size={24} />
            </div>
            <DialogTitle className="font-display text-2xl italic text-charcoal">Halo, {user?.name?.split(' ')[0]}!</DialogTitle>
            <DialogDescription className="text-charcoal-60 text-sm leading-relaxed">
              Selamat datang di Titip.in! Lengkapi profilmu sebentar yuk biar makin kece dan terpercaya di komunitas Malang.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-sm bg-white/50 relative">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-sage/20 to-terracotta/20 flex items-center justify-center text-2xl font-bold text-charcoal-30">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>
              <div className="w-full">
                <ImageUpload 
                  value={avatarUrl} 
                  onChange={setAvatarUrl} 
                  className="!h-auto !bg-transparent border-dashed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status-onboarding" className="text-xs font-bold uppercase tracking-wider text-charcoal-40">Status Kamu</Label>
              <Input
                id="status-onboarding"
                placeholder="Misal: Mahasiswa UB / Jastiper Suhat"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-11 rounded-xl border-subtle bg-white/50 focus:bg-white transition-all"
              />
            </div>
          </div>

          <DialogFooter className="mt-8 flex flex-col sm:flex-row gap-2">
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="rounded-full text-charcoal-40 hover:text-charcoal-60"
            >
              Nanti Saja
            </Button>
            <Button 
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="rounded-full bg-charcoal hover:bg-charcoal-80 text-white px-8"
            >
              {updateMutation.isPending ? "Menyimpan..." : "Mulai Jelajahi"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
