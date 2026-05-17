import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone } from "lucide-react";

export function GlobalAuthErrorListener() {
  const { authError, setAuthError, user, setAuth, token } = useAuthStore();
  const navigate = useNavigate();

  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isWaDialogOpen, setIsWaDialogOpen] = useState(false);
  
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [requestOtpLoading, setRequestOtpLoading] = useState(false);
  const [emailResendLoading, setEmailResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (authError === "PROFILE_INCOMPLETE") {
      setAuthError(null);
      navigate("/setup-profile");
    } else if (authError === "EMAIL_UNVERIFIED") {
      setIsEmailDialogOpen(true);
      setAuthError(null);
    } else if (authError === "WA_UNVERIFIED") {
      setIsWaDialogOpen(true);
      setAuthError(null);
    }
  }, [authError, navigate, setAuthError]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleResendEmail = async () => {
    setEmailResendLoading(true);
    try {
      await api.post("/v1/email/resend");
      toast.success("Email verifikasi telah dikirim ulang. Silakan cek kotak masuk Anda.");
      setIsEmailDialogOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal mengirim ulang email verifikasi.");
    } finally {
      setEmailResendLoading(false);
    }
  };

  const handleRequestOtp = async () => {
    setRequestOtpLoading(true);
    try {
      const res = await api.post("/v1/me/whatsapp/request-otp");
      if (res.data.success) {
        toast.success(`OTP telah dikirim ke WhatsApp Anda`);
        setResendTimer(60);
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
        toast.success("Nomor WhatsApp berhasil diverifikasi! Silakan ulangi tindakan Anda.");
        setIsWaDialogOpen(false);
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
    <>
      {/* Dialog Verifikasi Email */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="w-12 h-12 rounded-full bg-terracotta-pale text-terracotta flex items-center justify-center mx-auto mb-4">
              <Mail size={24} />
            </div>
            <DialogTitle className="text-center font-display text-2xl">Verifikasi Email Anda</DialogTitle>
            <DialogDescription className="text-center">
              Anda perlu memverifikasi alamat email <strong>{user?.email}</strong> sebelum dapat melanjutkan tindakan ini.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-col gap-2 mt-4">
            <Button
              onClick={handleResendEmail}
              disabled={emailResendLoading}
              className="w-full h-11 rounded-xl bg-terracotta text-white hover:bg-terracotta-dark"
            >
              {emailResendLoading ? "Mengirim Ulang..." : "Kirim Ulang Link Verifikasi"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsEmailDialogOpen(false)}
              className="w-full text-charcoal-60"
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Verifikasi WA */}
      <Dialog open={isWaDialogOpen} onOpenChange={(open) => {
        setIsWaDialogOpen(open);
        if (open) handleRequestOtp(); // Auto request OTP when opened
      }}>
        <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <div className="w-12 h-12 rounded-full bg-sage-pale text-sage-dark flex items-center justify-center mx-auto mb-4">
              <Phone size={24} />
            </div>
            <DialogTitle className="text-center font-display text-2xl">Verifikasi WhatsApp</DialogTitle>
            <DialogDescription className="text-center">
              Untuk menjaga keamanan dan kualitas transaksi, Anda perlu memverifikasi nomor WhatsApp sebelum melanjutkan.
              Kami telah mengirimkan 6 digit kode OTP ke nomor <strong className="text-charcoal">{user?.wa_number}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4">
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
            <div className="text-center text-xs text-charcoal-60 mt-2 flex flex-col gap-2">
              <span>Tidak menerima kode? <button onClick={handleRequestOtp} disabled={requestOtpLoading || resendTimer > 0} className={`font-medium ${resendTimer > 0 ? 'text-charcoal-30 cursor-not-allowed' : 'text-sage-dark hover:underline'}`}>{resendTimer > 0 ? `Kirim Ulang (${resendTimer}s)` : 'Kirim Ulang'}</button></span>
              <button onClick={() => {
                setIsWaDialogOpen(false);
                navigate("/profile");
              }} className="text-terracotta font-medium hover:underline">Ubah Nomor di Pengaturan</button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
