import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/v1/forgot-password", { email });
      setIsSuccess(true);
    } catch (error: any) {
      console.error("Forgot password failed:", error);
      toast.error(error.response?.data?.message || "Gagal memproses permintaan Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-6 py-12">
      <div className="w-full max-w-sm animate-fade-up">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-charcoal-60 hover:text-charcoal mb-8 transition-colors">
          <ArrowLeft size={16} />
          Kembali ke Login
        </Link>

        {isSuccess ? (
          <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-subtle">
            <div className="w-16 h-16 bg-sage-pale text-sage-dark rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="font-display text-2xl mb-3 text-charcoal font-medium">Cek Email Anda</h2>
            <p className="text-sm text-charcoal-60 mb-6 leading-relaxed">
              Kami telah mengirimkan tautan untuk mengatur ulang kata sandi ke <strong>{email}</strong>.
            </p>
            <Button
              onClick={() => setIsSuccess(false)}
              variant="outline"
              className="w-full rounded-xl"
            >
              Kirim Ulang Email
            </Button>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <h2 className="font-display text-2xl mb-2 text-charcoal font-medium">Lupa Password?</h2>
              <p className="text-sm text-charcoal-60">
                Jangan khawatir. Masukkan email yang terdaftar dan kami akan mengirimkan tautan reset password.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-charcoal-60">
                  Email
                </Label>
                <div className="relative mt-2">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-30" />
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 rounded-xl border-cream-dark bg-warm-white focus:bg-white transition-colors"
                    placeholder="okta@mail.com"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 bg-charcoal text-cream hover:bg-charcoal-80"
                disabled={loading}
              >
                {loading ? "Memproses..." : (
                  <>
                    Kirim Tautan Reset
                    <ArrowRight size={16} />
                  </>
                )}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
