import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Token reset password tidak valid atau tidak ditemukan.");
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Password dan Konfirmasi Password tidak cocok!");
      return;
    }
    setLoading(true);
    try {
      await api.post("/v1/reset-password", { token, password });
      useAuthStore.getState().logout();
      setIsSuccess(true);
    } catch (error: any) {
      console.error("Reset password failed:", error);
      toast.error(error.response?.data?.message || "Gagal mengatur ulang password Anda.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-6 py-12">
      <div className="w-full max-w-sm animate-fade-up">
        {isSuccess ? (
          <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-subtle">
            <div className="w-16 h-16 bg-sage-pale text-sage-dark rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="font-display text-2xl mb-3 text-charcoal font-medium">Berhasil!</h2>
            <p className="text-sm text-charcoal-60 mb-6 leading-relaxed">
              Kata sandi Anda telah berhasil diperbarui. Silakan masuk kembali menggunakan akun Anda di Web atau masuk kembali ke aplikasi Android Titip.in.
            </p>
            <Button
              onClick={() => navigate("/landing")}
              className="w-full rounded-xl bg-charcoal text-cream hover:bg-charcoal-80"
            >
              Kembali ke Beranda
            </Button>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <h2 className="font-display text-2xl mb-2 text-charcoal font-medium">Buat Password Baru</h2>
              <p className="text-sm text-charcoal-60">
                Silakan masukkan password baru Anda. Gunakan minimal 8 karakter.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-charcoal-60">
                  Password Baru
                </Label>
                <div className="relative mt-2">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-30" />
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11 rounded-xl border-cream-dark bg-warm-white focus:bg-white transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="confirm_password" className="text-xs font-semibold uppercase tracking-wider text-charcoal-60">
                  Konfirmasi Password Baru
                </Label>
                <div className="relative mt-2">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-30" />
                  <Input
                    id="confirm_password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 h-11 rounded-xl border-cream-dark bg-warm-white focus:bg-white transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full h-11 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 bg-charcoal text-cream hover:bg-charcoal-80"
                  disabled={loading}
                >
                  {loading ? "Menyimpan..." : (
                    <>
                      Simpan Password
                      <ArrowRight size={16} />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
