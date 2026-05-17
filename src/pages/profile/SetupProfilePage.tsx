import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Camera, ArrowRight, Save, Phone, CheckCircle2, X, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function SetupProfilePage() {
  const { user, setAuth, token } = useAuthStore();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [waNumber, setWaNumber] = useState(user?.wa_number || "");
  const [status, setStatus] = useState(user?.status || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || "");
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // OTP State
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [requestOtpLoading, setRequestOtpLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Format file tidak didukung. Harap unggah gambar.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar. Maksimal 2MB.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const res = await api.post("/v1/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        setAvatarUrl(res.data.data.image_url);
        toast.success("Foto profil berhasil diunggah!");
      }
    } catch (error: any) {
      console.error("Upload failed:", error);
      toast.error(error.response?.data?.message || "Gagal mengunggah foto.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSaveProfile = async () => {
    if (!user?.wa_verified_at) {
      toast.error("Silakan verifikasi nomor WhatsApp Anda terlebih dahulu.");
      return;
    }
    
    setLoading(true);
    try {
      const res = await api.put("/v1/me", {
        name,
        wa_number: waNumber,
        status,
        avatar_url: avatarUrl,
      });
      if (res.data.success && token) {
        setAuth(res.data.data, token);
        toast.success("Profil berhasil diperbarui!");
        navigate("/", { replace: true });
      }
    } catch (error: any) {
      console.error("Update profile failed:", error);
      toast.error(error.response?.data?.message || "Gagal memperbarui profil.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async () => {
    if (!waNumber) {
      toast.error("Silakan isi nomor WhatsApp terlebih dahulu.");
      return;
    }
    
    // Simpan profil sementara sebelum minta OTP untuk memastikan nomor WA tersimpan
    // atau request OTP dengan nomor WA yang diinput
    setRequestOtpLoading(true);
    try {
      await api.put("/v1/me", { name, wa_number: waNumber, status, avatar_url: avatarUrl });
      const res = await api.post("/v1/me/whatsapp/request-otp");
      if (res.data.success) {
        toast.success(`OTP telah dikirim ke WhatsApp ${waNumber}`);
        setResendTimer(60);
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
        // Ambil data user terbaru
        const userRes = await api.get("/v1/me");
        if (userRes.data.success && token) {
          setAuth(userRes.data.data, token);
        }
      }
    } catch (error: any) {
      console.error("Verify OTP failed:", error);
      toast.error(error.response?.data?.message || "OTP tidak valid atau kadaluarsa.");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-3xl p-8 border border-subtle shadow-sm animate-fade-up">
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl text-charcoal font-medium">Lengkapi Profil Anda</h1>
            <p className="text-sm text-charcoal-60 mt-1">Lengkapi data diri dan verifikasi nomor WhatsApp untuk melanjutkan.</p>
          </div>
        </div>

        <div className="mb-8 p-4 bg-sage/10 border border-sage/20 rounded-xl flex items-start gap-3">
          <ShieldCheck className="text-sage-dark shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="text-sm font-medium text-sage-dark">Keamanan & Kepercayaan Transaksi</h3>
            <p className="text-xs text-sage-dark/80 mt-1 leading-relaxed">
              Titip.in mewajibkan verifikasi WhatsApp sebagai <strong>Trust Layer</strong> untuk memastikan setiap pengguna adalah orang asli. Hal ini menjamin keamanan, mencegah penipuan, dan melancarkan komunikasi saat transaksi jastip atau preloved berlangsung.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center space-y-4">
            <div 
              className="relative w-32 h-32 rounded-full overflow-hidden bg-cream-dark border-4 border-white shadow-sm flex items-center justify-center group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="font-display text-4xl text-charcoal-40">{name ? name.charAt(0).toUpperCase() : "?"}</span>
              )}
              
              <div className="absolute inset-0 bg-charcoal/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {uploading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Camera size={24} className="text-white mb-1" />
                    <span className="text-xs text-white font-medium">Ubah Foto</span>
                  </>
                )}
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleImageUpload}
            />
            <p className="text-xs text-center text-charcoal-60 max-w-[150px]">
              Format: JPG, PNG. Maks: 2MB.
            </p>
          </div>

          {/* Form Fields */}
          <div className="flex-1 space-y-5">
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-charcoal-60">Nama Lengkap</Label>
              <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="mt-2 h-11 rounded-xl bg-warm-white focus:bg-white transition-colors"
                placeholder="Masukkan nama lengkap Anda"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-charcoal-60">Email (Tidak dapat diubah)</Label>
              <Input 
                value={user?.email || ""} 
                disabled
                className="mt-2 h-11 rounded-xl bg-cream-dark text-charcoal-60 border-transparent opacity-70"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-charcoal-60">Nomor WhatsApp</Label>
              <div className="flex gap-3 mt-2">
                <Input 
                  value={waNumber} 
                  onChange={(e) => setWaNumber(e.target.value)} 
                  className="flex-1 h-11 rounded-xl bg-warm-white focus:bg-white transition-colors"
                  placeholder="Contoh: 081234567890"
                />
                <Button 
                  type="button" 
                  variant={user?.wa_verified_at ? "default" : "outline"}
                  onClick={handleRequestOtp}
                  disabled={requestOtpLoading || !waNumber || !!user?.wa_verified_at || resendTimer > 0}
                  className={`h-11 rounded-xl transition-colors ${
                    user?.wa_verified_at 
                      ? "bg-sage text-white" 
                      : "border-sage text-sage-dark hover:bg-sage hover:text-white"
                  }`}
                >
                  {requestOtpLoading ? "Loading..." : (user?.wa_verified_at ? "Terverifikasi" : (resendTimer > 0 ? `Tunggu (${resendTimer}s)` : "Verifikasi WA"))}
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-charcoal-60">Bio / Status</Label>
              <Textarea 
                value={status} 
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setStatus(e.target.value)} 
                className="mt-2 rounded-xl bg-warm-white focus:bg-white transition-colors resize-none min-h-[100px]"
                placeholder="Ceritakan sedikit tentang Anda (Opsional)"
              />
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <Button 
            onClick={handleSaveProfile}
            disabled={loading}
            className="h-12 px-8 rounded-xl bg-charcoal text-cream hover:bg-charcoal-80 font-medium"
          >
            {loading ? "Menyimpan..." : (
              <>
                Simpan & Lanjutkan
                <Save size={18} className="ml-2" />
              </>
            )}
          </Button>
        </div>
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
              Tidak menerima kode? <button onClick={handleRequestOtp} disabled={requestOtpLoading || resendTimer > 0} className={`font-medium ${resendTimer > 0 ? 'text-charcoal-30 cursor-not-allowed' : 'text-sage-dark hover:underline'}`}>{resendTimer > 0 ? `Kirim Ulang (${resendTimer}s)` : 'Kirim Ulang'}</button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
