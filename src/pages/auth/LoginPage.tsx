import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { User, ApiResponse } from "@/types/api";
import api from "@/lib/api";
import { toast } from "sonner";
import { Mail, Lock, ArrowRight, Package, ShoppingBag, MessageCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post<ApiResponse<{ access_token: string; user: User }>>("/v1/login", {
        email,
        password,
      });

      const { user, access_token } = response.data.data;
      useAuthStore.getState().setAuth(user, access_token);
      navigate("/", { replace: true });
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error(error.response?.data?.message || "Login gagal! Silakan periksa kredensial Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden items-center justify-center"
        style={{ background: "var(--charcoal)" }}>
        {/* Decorative circles */}
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.06]"
          style={{ background: "var(--sage)", top: "-120px", right: "-100px" }} />
        <div className="absolute w-[300px] h-[300px] rounded-full opacity-[0.06]"
          style={{ background: "var(--terracotta)", bottom: "-60px", left: "-60px" }} />
        <div className="absolute w-[200px] h-[200px] rounded-full opacity-[0.04]"
          style={{ background: "var(--gold)", top: "40%", left: "20%" }} />

        <div className="relative z-10 px-16 max-w-lg">
          <Link to="/" className="inline-block mb-12">
            <span className="font-display text-3xl italic" style={{ color: "var(--cream)" }}>
              Titip.in
            </span>
          </Link>

          <h1 className="font-display text-4xl italic leading-tight mb-6"
            style={{ color: "var(--cream)", fontWeight: 400 }}>
            Jastip & Preloved
            <br />
            untuk Mahasiswa Malang
          </h1>

          <p className="text-base leading-relaxed mb-10"
            style={{ color: "rgba(245,242,236,0.5)" }}>
            Platform terpusat yang menghubungkan mahasiswa untuk jasa titip dan barang preloved — langsung via WhatsApp.
          </p>

          <div className="space-y-5">
            {[
              { icon: <Package size={18} />, text: "Jastip dua arah — Tersedia & Request" },
              { icon: <ShoppingBag size={18} />, text: "Preloved terstruktur — Dijual & Dicari" },
              { icon: <MessageCircle size={18} />, text: "Langsung terhubung via WhatsApp" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(143,175,138,0.15)", color: "var(--sage)" }}>
                  {item.icon}
                </div>
                <span className="text-sm font-medium" style={{ color: "rgba(245,242,236,0.7)" }}>
                  {item.text}
                </span>
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
              Selamat Datang
            </h2>
            <p className="text-sm" style={{ color: "var(--charcoal-60)" }}>
              Masuk ke akun Titip.in kamu
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
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
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-cream-dark bg-warm-white focus:bg-white transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded"
                  style={{ accentColor: "var(--sage)" }}
                />
                <Label htmlFor="remember-me" className="text-sm cursor-pointer"
                  style={{ color: "var(--charcoal-60)" }}>
                  Ingat saya
                </Label>
              </div>
              <a href="#" className="text-sm font-medium hover:underline"
                style={{ color: "var(--sage-dark)" }}>
                Lupa password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
              style={{
                background: "var(--charcoal)",
                color: "var(--cream)",
              }}
              disabled={loading}
            >
              {loading ? "Sedang masuk..." : (
                <>
                  Masuk
                  <ArrowRight size={16} />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm" style={{ color: "var(--charcoal-60)" }}>
              Belum punya akun?{" "}
              <Link
                to="/register"
                className="font-semibold hover:underline"
                style={{ color: "var(--terracotta)" }}
              >
                Daftar Gratis
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
