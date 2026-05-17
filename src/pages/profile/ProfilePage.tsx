import React, { useState, useEffect } from "react";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useAuthStore } from "@/stores/authStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Package, ShoppingBag, LogOut, Mail, Info, ShieldCheck, AlertCircle, Phone, Lock, KeyRound } from "lucide-react";
import { useActiveItemCount } from "@/hooks/useActiveItemCount";
import api from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfile();
  const updateMutation = useUpdateProfile();
  const setAuthUser = useAuthStore((state) => state.setAuth);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const { 
    jastipListingActiveCount, 
    jastipRequestActiveCount, 
    prelovedListingActiveCount, 
    prelovedRequestActiveCount,
    isJastipListingLimitReached,
    isJastipRequestLimitReached,
    isPrelovedListingLimitReached,
    isPrelovedRequestLimitReached,
    ACTIVE_LIMIT 
  } = useActiveItemCount();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const [name, setName] = useState("");
  const [waNumber, setWaNumber] = useState("");
  const [status, setStatus] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // OTP State
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [requestOtpLoading, setRequestOtpLoading] = useState(false);
  const [emailResendLoading, setEmailResendLoading] = useState(false);
  
  // Password State
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setWaNumber(profile.wa_number || "");
      setStatus(profile.status || "");
      setAvatarUrl(profile.avatar_url || null);
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isWaChanged = waNumber !== profile?.wa_number;
      
      const updatedUser = await updateMutation.mutateAsync({
        name,
        wa_number: waNumber,
        status,
        avatar_url: avatarUrl
      });
      // Update the local auth store so sidebar/topbar updates immediately
      if (token) {
        setAuthUser(updatedUser, token);
      }
      
      if (isWaChanged) {
        toast.success("Profil diperbarui. Silakan verifikasi nomor WhatsApp baru Anda.");
        handleRequestOtp();
      } else {
        toast.success("Profil berhasil diperbarui!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal memperbarui profil.");
    }
  };

  const handleRequestOtp = async () => {
    setRequestOtpLoading(true);
    try {
      const res = await api.post("/v1/me/whatsapp/request-otp");
      if (res.data.success) {
        toast.success(`OTP telah dikirim ke WhatsApp ${waNumber}`);
        setIsOtpDialogOpen(true);
      }
    } catch (error: any) {
      console.error("Request OTP failed:", error);
      toast.error(error.response?.data?.message || "Gagal mengirim OTP.");
    } finally {
      setRequestOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Silakan masukkan OTP.");
      return;
    }
    setOtpLoading(true);
    try {
      const res = await api.post("/v1/me/whatsapp/verify-otp", { otp });
      if (res.data.success) {
        toast.success("Nomor WhatsApp berhasil diverifikasi!");
        setIsOtpDialogOpen(false);
        const userRes = await api.get("/v1/me");
        if (userRes.data.success && token) {
          setAuthUser(userRes.data.data, token);
        }
      }
    } catch (error: any) {
      console.error("Verify OTP failed:", error);
      toast.error(error.response?.data?.message || "OTP tidak valid atau kadaluarsa.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setEmailResendLoading(true);
    try {
      await api.post("/v1/email/resend");
      toast.success("Email verifikasi telah dikirim ulang. Silakan cek kotak masuk Anda.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal mengirim ulang email verifikasi.");
    } finally {
      setEmailResendLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      toast.error("Password baru dan konfirmasi tidak cocok!");
      return;
    }
    setPasswordLoading(true);
    try {
      await api.put("/v1/me/password", {
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirmation: confirmNewPassword
      });
      toast.success("Password berhasil diubah!");
      setIsPasswordDialogOpen(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal mengubah password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleForgotPasswordForGoogleUser = async () => {
    if (!profile?.email) return;
    setForgotPasswordLoading(true);
    try {
      await api.post("/v1/forgot-password", { email: profile.email });
      toast.success("Link reset password telah dikirim ke email Anda.");
      setIsPasswordDialogOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal mengirim link reset password.");
    } finally {
      setForgotPasswordLoading(false);
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
            <Label className="text-sm font-medium text-charcoal-60 flex items-center justify-between">
              <span>Email</span>
              {profile?.email_verified_at ? (
                <span className="flex items-center text-sage text-xs font-semibold px-2 py-0.5 rounded bg-sage-pale">
                  <ShieldCheck size={12} className="mr-1" /> Terverifikasi
                </span>
              ) : (
                <span className="flex items-center text-terracotta text-xs font-semibold px-2 py-0.5 rounded bg-terracotta-pale">
                  <AlertCircle size={12} className="mr-1" /> Belum Terverifikasi
                </span>
              )}
            </Label>
            <Input
              value={profile?.email || ""}
              disabled
              className="mt-1 bg-charcoal-10/50 cursor-not-allowed"
            />
            {!profile?.email_verified_at ? (
              <Button 
                type="button" 
                variant="link" 
                onClick={handleResendEmail} 
                disabled={emailResendLoading}
                className="p-0 h-auto text-xs text-sage-dark hover:text-sage mt-1.5"
              >
                {emailResendLoading ? "Mengirim..." : "Kirim Ulang Email Verifikasi"}
              </Button>
            ) : (
              <p className="text-xs text-charcoal-30 mt-1">Email tidak dapat diubah</p>
            )}
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
            <Label htmlFor="status" className="text-sm font-medium text-charcoal-60">Status Profil</Label>
            <Input
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1"
              placeholder="Contoh: Mahasiswa FILKOM UB"
            />
            <p className="text-xs text-charcoal-30 mt-1">Status ini akan ditampilkan di halaman detail Jastip dan Preloved Anda.</p>
          </div>
          <div>
            <Label htmlFor="wa_number" className="text-sm font-medium text-charcoal-60 flex items-center justify-between">
              <span>Nomor WhatsApp</span>
              {/* Note: since API doesn't expose wa_verified_at explicitly yet, we'll just show the request OTP button if they want to verify */}
            </Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="wa_number"
                required
                value={waNumber}
                onChange={(e) => setWaNumber(e.target.value)}
                className="flex-1"
                placeholder="Contoh: 6281234567890"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleRequestOtp}
                disabled={requestOtpLoading || waNumber !== profile?.wa_number}
                className="border-sage text-sage-dark hover:bg-sage hover:text-white"
                title={waNumber !== profile?.wa_number ? "Simpan profil terlebih dahulu untuk memverifikasi nomor baru" : "Verifikasi Nomor WA"}
              >
                {requestOtpLoading ? "Memproses..." : "Verifikasi"}
              </Button>
            </div>
            <p className="text-xs text-charcoal-30 mt-1">Ganti nomor WA harus diikuti dengan verifikasi OTP kembali.</p>
          </div>
        </div>

        <div className="pt-6 border-t border-subtle flex flex-col-reverse sm:flex-row justify-between gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setIsPasswordDialogOpen(true)}
            className="rounded-full border-charcoal-20 text-charcoal hover:bg-charcoal-10"
          >
            <KeyRound size={16} className="mr-2" />
            Ganti Password
          </Button>
          <Button 
            type="submit" 
            className="rounded-full bg-charcoal hover:bg-charcoal-80 text-white w-full sm:w-auto px-8"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </form>

      {/* Limit Status Section */}
      <div className="mt-8 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="font-display text-[20px] font-medium text-charcoal">Batas Penggunaan Aktif</h2>
          <div className="group relative">
            <Info size={16} className="text-charcoal-30 cursor-help" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-charcoal text-cream text-[11px] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl z-20">
              Setiap kategori dibatasi maksimal {ACTIVE_LIMIT} item aktif secara bersamaan untuk menjaga kualitas layanan Titip.in.
              <div className="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent border-t-charcoal"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-elevated border border-subtle rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Jastip Listing */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[13px] font-semibold text-charcoal flex items-center gap-1.5">📦 Jastip Listing</span>
                <span className={`text-[12px] font-bold ${isJastipListingLimitReached ? 'text-terracotta' : 'text-charcoal-60'}`}>
                  {jastipListingActiveCount}/{ACTIVE_LIMIT}
                </span>
              </div>
              <div className="w-full h-1.5 bg-charcoal-10 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-700 ease-out ${isJastipListingLimitReached ? 'bg-terracotta' : 'bg-sage'}`}
                  style={{ width: `${(jastipListingActiveCount / ACTIVE_LIMIT) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Jastip Request */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[13px] font-semibold text-charcoal flex items-center gap-1.5">📍 Jastip Request</span>
                <span className={`text-[12px] font-bold ${isJastipRequestLimitReached ? 'text-terracotta' : 'text-charcoal-60'}`}>
                  {jastipRequestActiveCount}/{ACTIVE_LIMIT}
                </span>
              </div>
              <div className="w-full h-1.5 bg-charcoal-10 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-700 ease-out ${isJastipRequestLimitReached ? 'bg-terracotta' : 'bg-gold'}`}
                  style={{ width: `${(jastipRequestActiveCount / ACTIVE_LIMIT) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Preloved Listing */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[13px] font-semibold text-charcoal flex items-center gap-1.5">🛍️ Preloved Listing</span>
                <span className={`text-[12px] font-bold ${isPrelovedListingLimitReached ? 'text-terracotta' : 'text-charcoal-60'}`}>
                  {prelovedListingActiveCount}/{ACTIVE_LIMIT}
                </span>
              </div>
              <div className="w-full h-1.5 bg-charcoal-10 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-700 ease-out ${isPrelovedListingLimitReached ? 'bg-terracotta' : 'bg-terracotta-light'}`}
                  style={{ width: `${(prelovedListingActiveCount / ACTIVE_LIMIT) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Preloved Request */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[13px] font-semibold text-charcoal flex items-center gap-1.5">🔍 Preloved Request</span>
                <span className={`text-[12px] font-bold ${isPrelovedRequestLimitReached ? 'text-terracotta' : 'text-charcoal-60'}`}>
                  {prelovedRequestActiveCount}/{ACTIVE_LIMIT}
                </span>
              </div>
              <div className="w-full h-1.5 bg-charcoal-10 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-700 ease-out ${isPrelovedRequestLimitReached ? 'bg-terracotta' : 'bg-charcoal-60'}`}
                  style={{ width: `${(prelovedRequestActiveCount / ACTIVE_LIMIT) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 mb-4">
        <h2 className="font-display text-[20px] font-medium text-charcoal mb-4">Aktivitas Saya</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div 
            onClick={() => navigate('/jastip/mine')}
            className="bg-elevated border border-subtle rounded-xl p-5 shadow-sm cursor-pointer hover:shadow-md hover:border-charcoal-30 transition-all duration-200 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-sage-pale text-sage flex items-center justify-center flex-shrink-0">
              <Package size={24} />
            </div>
            <div>
              <div className="font-medium text-charcoal text-[15px]">Jastip Saya</div>
              <div className="text-[13px] text-charcoal-60 mt-0.5">Kelola listing & request jastip</div>
            </div>
          </div>
          
          <div 
            onClick={() => navigate('/preloved/mine')}
            className="bg-elevated border border-subtle rounded-xl p-5 shadow-sm cursor-pointer hover:shadow-md hover:border-charcoal-30 transition-all duration-200 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-terracotta-pale text-terracotta flex items-center justify-center flex-shrink-0">
              <ShoppingBag size={24} />
            </div>
            <div>
              <div className="font-medium text-charcoal text-[15px]">Preloved Saya</div>
              <div className="text-[13px] text-charcoal-60 mt-0.5">Kelola barang & request preloved</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 mb-4">
        <h2 className="font-display text-[20px] font-medium text-charcoal mb-4">Bantuan & Dukungan</h2>
        <a 
          href="mailto:support@titipin.me"
          className="bg-elevated border border-subtle rounded-xl p-5 shadow-sm cursor-pointer hover:shadow-md hover:border-charcoal-30 transition-all duration-200 flex items-center gap-4 block"
        >
          <div className="w-12 h-12 rounded-full bg-gold-pale text-gold-dark flex items-center justify-center flex-shrink-0">
            <Mail size={24} />
          </div>
          <div>
            <div className="font-medium text-charcoal text-[15px]">Hubungi Support</div>
            <div className="text-[13px] text-charcoal-60 mt-0.5">Kirim email ke support@titipin.me</div>
          </div>
        </a>
      </div>

      <div className="mt-8 border-t border-subtle pt-8 flex justify-center pb-8">
        <Button 
          variant="default"
          onClick={handleLogout}
          className="rounded-full bg-red text-white hover:opacity-90 hover:text-white transition-opacity w-full sm:w-auto px-8 flex items-center gap-2 font-medium"
        >
          <LogOut size={18} />
          <span>Keluar dari Akun</span>
        </Button>
      </div>

      {/* OTP Verification Dialog */}
      <Dialog open={isOtpDialogOpen} onOpenChange={setIsOtpDialogOpen}>
        <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="text-center font-display text-2xl">Verifikasi WhatsApp</DialogTitle>
            <DialogDescription className="text-center">
              Kami telah mengirimkan 6 digit kode OTP via WhatsApp ke nomor <strong className="text-charcoal">{waNumber}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4">
            <div className="w-16 h-16 bg-sage-pale text-sage-dark rounded-full flex items-center justify-center">
              <Phone size={32} />
            </div>
            <Input
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="text-center text-2xl tracking-widest h-14 w-48 rounded-xl font-medium focus:ring-2 focus:ring-sage"
              placeholder="000000"
              maxLength={6}
            />
          </div>
          <DialogFooter className="flex-col sm:flex-col gap-2">
            <Button
              onClick={handleVerifyOtp}
              disabled={otpLoading || otp.length < 6}
              className="w-full h-11 rounded-xl bg-sage-dark text-white hover:bg-sage-80"
            >
              {otpLoading ? "Memverifikasi..." : "Verifikasi OTP"}
            </Button>
            <div className="text-center text-xs text-charcoal-60 mt-2">
              Tidak menerima kode? <button onClick={handleRequestOtp} disabled={requestOtpLoading} className="text-sage-dark font-medium hover:underline">Kirim Ulang</button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Ganti Password</DialogTitle>
            <DialogDescription>
              Perbarui kata sandi Anda secara berkala untuk menjaga keamanan akun.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-sage-pale/50 p-3.5 rounded-xl border border-sage/30 text-[13px] text-sage-dark mb-2">
              <p className="mb-1.5">Login via Google atau lupa password saat ini?</p>
              <button 
                onClick={handleForgotPasswordForGoogleUser}
                disabled={forgotPasswordLoading}
                className="font-medium underline hover:opacity-80 transition-opacity"
              >
                {forgotPasswordLoading ? "Mengirim link..." : "Kirim link buat/reset password ke Email"}
              </button>
            </div>
            <div>
              <Label htmlFor="old-password">Password Lama</Label>
              <Input
                id="old-password"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="mt-1"
                placeholder="••••••••"
              />
            </div>
            <div>
              <Label htmlFor="new-password">Password Baru</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1"
                placeholder="••••••••"
              />
            </div>
            <div>
              <Label htmlFor="confirm-new-password">Konfirmasi Password Baru</Label>
              <Input
                id="confirm-new-password"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="mt-1"
                placeholder="••••••••"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleChangePassword}
              disabled={passwordLoading || !oldPassword || !newPassword || !confirmNewPassword}
              className="w-full sm:w-auto h-11 rounded-xl bg-charcoal text-white hover:bg-charcoal-80"
            >
              {passwordLoading ? "Menyimpan..." : "Simpan Password Baru"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
