import React, { useState, useEffect } from "react";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useAuthStore } from "@/stores/authStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { toast } from "sonner";

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfile();
  const updateMutation = useUpdateProfile();
  const setAuthUser = useAuthStore((state) => state.setAuth);
  const token = useAuthStore((state) => state.token);

  const [name, setName] = useState("");
  const [waNumber, setWaNumber] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setWaNumber(profile.wa_number || "");
      setAvatarUrl(profile.avatar_url || null);
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedUser = await updateMutation.mutateAsync({
        name,
        wa_number: waNumber,
        avatar_url: avatarUrl
      });
      // Update the local auth store so sidebar/topbar updates immediately
      if (token) {
        setAuthUser(updatedUser, token);
      }
      toast.success("Profil berhasil diperbarui!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal memperbarui profil.");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-[600px] mx-auto py-20 text-center flex flex-col items-center">
        <svg className="animate-spin h-8 w-8 mb-4 text-sage" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-charcoal-60">Memuat profil...</span>
      </div>
    );
  }

  return (
    <div className="max-w-[600px] mx-auto py-8 animate-fade-in">
      <h1 className="font-display text-[32px] font-medium text-charcoal mb-2">Profil Saya</h1>
      <p className="text-[15px] text-charcoal-60 mb-8">Atur informasi profil dan kontak Anda.</p>

      <form className="bg-elevated border border-subtle rounded-xl p-8 shadow-sm space-y-6" onSubmit={handleSubmit}>
        <div className="flex flex-col items-center mb-6">
          <div className="w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-white shadow-md relative group">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-sage to-terracotta flex items-center justify-center text-4xl font-bold text-white">
                {name.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </div>
          <div className="w-full max-w-[200px]">
            <ImageUpload 
              value={avatarUrl} 
              onChange={setAvatarUrl} 
              className="!h-auto"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-charcoal-60">Email</Label>
            <Input
              value={profile?.email || ""}
              disabled
              className="mt-1 bg-charcoal-10/50 cursor-not-allowed"
            />
            <p className="text-xs text-charcoal-30 mt-1">Email tidak dapat diubah</p>
          </div>
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-charcoal-60">Nama Lengkap</Label>
            <Input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="wa_number" className="text-sm font-medium text-charcoal-60">Nomor WhatsApp</Label>
            <Input
              id="wa_number"
              required
              value={waNumber}
              onChange={(e) => setWaNumber(e.target.value)}
              className="mt-1"
              placeholder="Contoh: 6281234567890"
            />
            <p className="text-xs text-charcoal-30 mt-1">Gunakan kode negara (contoh: 62 untuk Indonesia)</p>
          </div>
        </div>

        <div className="pt-6 border-t border-subtle flex justify-end">
          <Button 
            type="submit" 
            className="rounded-full bg-charcoal hover:bg-charcoal-80 text-white w-full sm:w-auto px-8"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </form>
    </div>
  );
}
