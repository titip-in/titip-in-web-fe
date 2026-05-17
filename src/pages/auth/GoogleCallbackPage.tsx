import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const processed = useRef(false);

  useEffect(() => {
    const processCallback = async () => {
      if (processed.current) return;
      processed.current = true;

      if (!token) {
        toast.error("Autentikasi Google gagal (Token tidak ditemukan).");
        navigate("/login", { replace: true });
        return;
      }

      try {
        // Set token sementara untuk fetch profile
        useAuthStore.setState({ token });
        
        // Ambil data user
        const res = await api.get("/v1/me");
        if (res.data.success) {
          const user = res.data.data;
          // Set auth penuh
          useAuthStore.getState().setAuth(user, token);
          
          // Cek apakah profil lengkap (misal wa_number kosong berarti user baru/belum lengkap)
          if (!user.wa_number) {
            navigate("/setup-profile", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile during Google callback:", error);
        toast.error("Gagal mengambil profil pengguna.");
        navigate("/login", { replace: true });
      }
    };

    processCallback();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream px-6">
      <Loader2 size={40} className="text-sage animate-spin mb-4" />
      <h2 className="font-display text-xl text-charcoal">Memproses Autentikasi...</h2>
      <p className="text-sm text-charcoal-60 mt-2">Mohon tunggu sebentar sementara kami masuk ke akun Anda.</p>
    </div>
  );
}
