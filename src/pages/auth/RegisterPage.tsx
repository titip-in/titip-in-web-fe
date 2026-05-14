import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, ApiResponse } from "@/types/api";
import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/api";
import { toast } from "sonner";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
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
      useAuthStore.getState().setAuth(user, access_token);
      navigate("/", { replace: true });
    } catch (error: any) {
      console.error("Register failed:", error);
      toast.error(error.response?.data?.message || "Registrasi gagal! Silakan periksa data Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <div className="text-center">
            <h2 className="text-3xl font-display text-charcoal">
              Daftar Akun Baru
            </h2>
            <p className="text-sm text-charcoal-60">
              Bergabung dengan komunitas Titip.in
            </p>
          </div>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-charcoal-60">
              Nama Lengkap
            </Label>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full"
              placeholder="Aisyah Rahmawati"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium text-charcoal-60">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full"
              placeholder="okta@mail.com"
            />
          </div>

          <div>
            <Label htmlFor="whatsapp_number" className="text-sm font-medium text-charcoal-60">
              Nomor WhatsApp
            </Label>
            <Input
              id="whatsapp_number"
              type="tel"
              autoComplete="tel"
              required
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="mt-1 block w-full"
              placeholder="+62 812-3456-7890"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-medium text-charcoal-60">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full"
              placeholder="••••••••"
            />
          </div>

          <div>
            <Label htmlFor="confirm_password" className="text-sm font-medium text-charcoal-60">
              Konfirmasi Password
            </Label>
            <Input
              id="confirm_password"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="agree-terms"
                type="checkbox"
                className="h-4 w-4 text-sage focus:ring-sage border-border rounded"
              />
              <Label
                htmlFor="agree-terms"
                className="ml-2 block text-sm text-charcoal-60"
              >
                Saya setuju dengan <a href="#" className="text-sage hover:text-sage-dark">syarat dan ketentuan</a>
              </Label>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md shadow-sm bg-sage text-cream hover:bg-sage-dark focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Sedang mendaftar..." : "Daftar"}
            </Button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-charcoal-60">
            Sudah punya akun?
            <Link
              to="/login"
              className="font-medium text-terracotta hover:text-terracotta-dark"
            >
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
