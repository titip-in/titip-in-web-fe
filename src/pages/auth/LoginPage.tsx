import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuthStore, User } from "@/stores/authStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Dummy Auth check
      if ((email === "admin" || email === "admin@admin.com") && password === "admin") {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const dummyUser: User = {
          id: "usr_123",
          name: "Admin Okta",
          whatsapp_number: "08123456789",
          email: "admin@admin.com",
          profile_picture_url: null,
          role: "admin",
        };
        const dummyToken = "dummy_token_12345";
        
        useAuthStore.getState().setAuth(dummyUser, dummyToken);
        navigate("/", { replace: true });
      } else {
        alert("Email atau password salah! Gunakan admin / admin");
      }
    } catch (error) {
      console.error("Login failed:", error);
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
              Selamat Datang
            </h2>
            <p className="text-sm text-charcoal-60">
              Platform jastip & preloved untuk mahasiswa Malang
            </p>
          </div>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
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
            <Label htmlFor="password" className="text-sm font-medium text-charcoal-60">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-sage focus:ring-sage border-border rounded"
              />
              <Label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-charcoal-60"
              >
                Ingat saya
              </Label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-sage hover:text-sage-dark">
                Lupa password?
              </a>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md shadow-sm bg-sage text-cream hover:bg-sage-dark focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Sedang masuk..." : "Masuk"}
            </Button>
          </div>
        </form>

        <div className="text-center">
          <div className="flex items-center border-t border-border pt-4">
            <div className="flex-1 border-b border-border" />
            <div className="px-4 text-sm text-charcoal-60">
              atau
            </div>
            <div className="flex-1 border-b border-border" />
          </div>
        </div>

        <div className="flex items-center justify-center">
          <Button
            variant="outline"
            className="w-full flex justify-center py-2 px-4 border border-border text-sm font-medium rounded-md shadow-sm bg-cream-dark text-charcoal hover:bg-charcoal/5 focus:outline-none focus:ring-2 focus:ring-charcoal focus:ring-offset-2"
          >
            Masuk via WhatsApp
          </Button>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-charcoal-60">
            Belum punya akun?
            <a
              href="/auth/register"
              className="font-medium text-terracotta hover:text-terracotta-dark"
            >
              Daftar
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
