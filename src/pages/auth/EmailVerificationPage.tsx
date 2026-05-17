import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";

export default function EmailVerificationPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Memverifikasi email Anda...");
  const hasAttempted = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token verifikasi tidak valid atau tidak ditemukan.");
      return;
    }

    if (hasAttempted.current) return;
    hasAttempted.current = true;

    const verifyEmail = async () => {
      try {
        await api.post("/v1/email/verify", { token });
        
        setStatus("success");
        setMessage("Email Anda berhasil diverifikasi!");
        
        // Update user state if logged in
        if (user) {
          setUser({ ...user, email_verified_at: new Date().toISOString() });
        }
      } catch (error: any) {
        setStatus("error");
        setMessage(error.response?.data?.message || "Link verifikasi tidak valid atau sudah kadaluarsa.");
      }
    };

    verifyEmail();
  }, [token, user, setUser]);

  return (
    <div className="min-h-screen bg-warm-white flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-sm border border-subtle text-center">
        <Link to="/" className="inline-block mb-8">
          <span className="font-display text-2xl italic text-terracotta">Titip.in</span>
        </Link>

        {status === "loading" && (
          <div className="py-8 flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-sage animate-spin mb-4" />
            <h2 className="text-xl font-display font-medium text-charcoal mb-2">Sedang Memverifikasi</h2>
            <p className="text-charcoal-60">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div className="py-6 flex flex-col items-center">
            <div className="w-16 h-16 bg-sage-pale rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8 text-sage" />
            </div>
            <h2 className="text-2xl font-display font-medium text-charcoal mb-3">Verifikasi Berhasil!</h2>
            <p className="text-charcoal-60 mb-8">{message}</p>
            
            <Button 
              onClick={() => {
                if (user && (!user.status || !user.avatar_url)) {
                  navigate('/setup-profile');
                } else {
                  navigate('/');
                }
              }} 
              className="w-full bg-charcoal hover:bg-charcoal-80 text-white rounded-full py-6 font-semibold flex items-center gap-2 justify-center"
            >
              Lanjutkan ke Titip.in <ArrowRight size={18} />
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="py-6 flex flex-col items-center">
            <div className="w-16 h-16 bg-red/10 rounded-full flex items-center justify-center mb-6">
              <XCircle className="w-8 h-8 text-red" />
            </div>
            <h2 className="text-2xl font-display font-medium text-charcoal mb-3">Verifikasi Gagal</h2>
            <p className="text-charcoal-60 mb-8">{message}</p>
            
            <div className="flex flex-col gap-3 w-full">
              {user ? (
                <Button 
                  onClick={() => navigate('/profile')}
                  className="w-full bg-charcoal hover:bg-charcoal-80 text-white rounded-full py-6 font-semibold"
                >
                  Kirim Ulang dari Profil
                </Button>
              ) : (
                <Button 
                  onClick={() => navigate('/login')}
                  className="w-full bg-charcoal hover:bg-charcoal-80 text-white rounded-full py-6 font-semibold"
                >
                  Masuk ke Akun
                </Button>
              )}
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full border-charcoal-20 text-charcoal rounded-full py-6 font-semibold hover:bg-charcoal-10"
              >
                Kembali ke Beranda
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
