import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, ApiResponse } from "@/types/api";
import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/api";
import { toast } from "sonner";
import { User as UserIcon, Mail, Phone, Lock, ArrowRight, Search, RefreshCw, Shield } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Password dan Konfirmasi Password tidak cocok!");
      return;
    }
    setLoading(true);
    try {
      const response = await api.post<ApiResponse<{ access_token: string; user: User }>>("/v1/register", {
        name,
        email,
        wa_number: whatsappNumber,
        password,
      });

      const { user, access_token } = response.data.data;
      setIsVerifyDialogOpen(true);
    } catch (error: any) {
      console.error("Register failed:", error);
      toast.error(error.response?.data?.message || "Registrasi gagal! Silakan periksa data Anda.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const res = await api.get("/v1/auth/google");
      if (res.data.success && res.data.data?.url) {
        window.location.href = res.data.data.url;
      }
    } catch (error) {
      toast.error("Gagal menghubungkan ke Google.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden items-center justify-center"
        style={{ background: "var(--charcoal)" }}>
        {/* Decorative circles */}
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.06]"
          style={{ background: "var(--terracotta)", top: "-120px", left: "-100px" }} />
        <div className="absolute w-[300px] h-[300px] rounded-full opacity-[0.06]"
          style={{ background: "var(--sage)", bottom: "-60px", right: "-60px" }} />
        <div className="absolute w-[200px] h-[200px] rounded-full opacity-[0.04]"
          style={{ background: "var(--gold)", top: "30%", right: "25%" }} />

        <div className="relative z-10 px-16 max-w-lg">
          <Link to="/" className="inline-block mb-12">
            <span className="font-display text-3xl italic" style={{ color: "var(--cream)" }}>
              Titip.in
            </span>
          </Link>

          <h1 className="font-display text-4xl italic leading-tight mb-6"
            style={{ color: "var(--cream)", fontWeight: 400 }}>
            Gabung dengan
            <br />
            Titip.in
          </h1>

          <p className="text-base leading-relaxed mb-10"
            style={{ color: "rgba(245,242,236,0.5)" }}>
            Daftar gratis dan mulai temukan jastip serta preloved terbaik dari sesama warga Malang.
          </p>

          <div className="space-y-5">
            {[
              { icon: <Search size={18} />, title: "Temukan Dengan Mudah", desc: "Filter berdasarkan kategori, rute, dan lokasi" },
              { icon: <RefreshCw size={18} />, title: "Post & Request", desc: "Dua arah — kamu bisa jadi provider maupun requester" },
              { icon: <Shield size={18} />, title: "Aman & Terpercaya", desc: "Profil terverifikasi dan sistem rating" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "rgba(200,113,74,0.15)", color: "var(--terracotta-light)" }}>
                  {item.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: "rgba(245,242,236,0.85)" }}>
                    {item.title}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "rgba(245,242,236,0.4)" }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12"
        style={{ background: "var(--cream)" }}>
        <div className="w-full max-w-sm animate-fade-up">
          {/* Mobile brand */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-block">
              <span className="font-display text-2xl italic" style={{ color: "var(--charcoal)" }}>
                Titip.in
              </span>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-2xl mb-2" style={{ color: "var(--charcoal)", fontWeight: 500 }}>
              Daftar Akun Baru
            </h2>
            <p className="text-sm" style={{ color: "var(--charcoal-60)" }}>
              Bergabung dengan Titip.in — gratis!
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--charcoal-60)" }}>
                Nama Lengkap
              </Label>
              <div className="relative mt-2">
                <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--charcoal-30)" }} />
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-cream-dark bg-warm-white focus:bg-white transition-colors"
                  placeholder="Aisyah Rahmawati"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--charcoal-60)" }}>
                Email
              </Label>
              <div className="relative mt-2">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--charcoal-30)" }} />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-cream-dark bg-warm-white focus:bg-white transition-colors"
                  placeholder="okta@mail.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="whatsapp_number" className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--charcoal-60)" }}>
                Nomor WhatsApp
              </Label>
              <div className="relative mt-2">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--charcoal-30)" }} />
                <Input
                  id="whatsapp_number"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-cream-dark bg-warm-white focus:bg-white transition-colors"
                  placeholder="+62 812-3456-7890"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--charcoal-60)" }}>
                  Password
                </Label>
                <div className="relative mt-2">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--charcoal-30)" }} />
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11 rounded-xl border-cream-dark bg-warm-white focus:bg-white transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="confirm_password" className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--charcoal-60)" }}>
                  Konfirmasi
                </Label>
                <div className="relative mt-2">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--charcoal-30)" }} />
                  <Input
                    id="confirm_password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 h-11 rounded-xl border-cream-dark bg-warm-white focus:bg-white transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>



              <Button
                type="submit"
                className="w-full h-11 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                style={{
                  background: "var(--terracotta)",
                  color: "white",
                }}
                disabled={loading}
              >
                {loading ? "Sedang mendaftar..." : (
                  <>
                    Daftar Sekarang
                    <ArrowRight size={16} />
                  </>
                )}
              </Button>
            </form>

            <div className="relative mt-6 mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: "var(--charcoal-20)" }}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2" style={{ background: "var(--cream)", color: "var(--charcoal-40)" }}>Atau</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleRegister}
              className="w-full h-11 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border-2 border-charcoal-20 hover:bg-charcoal-10 transition-all"
              style={{
                color: "var(--charcoal)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.8 15.71 17.58V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4" />
                <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.58C14.73 18.24 13.48 18.64 12 18.64C9.13 18.64 6.7 16.7 5.82 14.1H2.13V16.96C3.95 20.58 7.68 23 12 23Z" fill="#34A853" />
                <path d="M5.82 14.1C5.59 13.43 5.46 12.73 5.46 12C5.46 11.27 5.59 10.57 5.82 9.9V7.04H2.13C1.38 8.53 0.96 10.22 0.96 12C0.96 13.78 1.38 15.47 2.13 16.96L5.82 14.1Z" fill="#FBBC05" />
                <path d="M12 5.36C13.62 5.36 15.07 5.92 16.21 7.01L19.36 3.86C17.45 2.08 14.97 1 12 1C7.68 1 3.95 3.42 2.13 7.04L5.82 9.9C6.7 7.3 9.13 5.36 12 5.36Z" fill="#EA4335" />
              </svg>
              Daftar dengan Google
            </Button>

          <div className="mt-8 text-center">
            <p className="text-sm" style={{ color: "var(--charcoal-60)" }}>
              Sudah punya akun?{" "}
              <Link
                to="/login"
                className="font-semibold hover:underline"
                style={{ color: "var(--charcoal)" }}
              >
                Masuk
              </Link>
            </p>
          </div>
        </div>
      </div>
      <AlertDialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="w-12 h-12 rounded-full bg-sage-pale text-sage-dark flex items-center justify-center mb-4">
              <Mail size={24} />
            </div>
            <AlertDialogTitle>Verifikasi Email Anda</AlertDialogTitle>
            <AlertDialogDescription className="text-charcoal-60 space-y-3">
              <p>Kami telah mengirimkan tautan verifikasi ke email <strong>{email}</strong>.</p>
              <p>Silakan periksa kotak masuk atau folder spam Anda dan klik tautan untuk memverifikasi akun.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => {
              setIsVerifyDialogOpen(false);
              navigate('/landing');
            }} className="bg-sage hover:bg-sage-dark text-white rounded-full px-6">
              Kembali ke Beranda
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
