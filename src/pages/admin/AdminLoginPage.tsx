import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "@/stores/adminStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAdminStore((state) => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Silakan isi email dan password");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/v1/admin/login`, {
        email,
        password,
      });
      
      const { user, access_token } = response.data.data;
      setAuth(user, access_token);
      toast.success("Login berhasil");
      navigate("/hidupjokowi/users");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Login gagal. Cek kembali email/password Anda.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-10 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-subtle">
        <div className="bg-charcoal p-6 text-center">
          <h1 className="font-display text-2xl text-cream font-bold">Titip.in Admin</h1>
          <p className="text-cream/70 text-sm mt-1">Masuk ke Dashboard Administrator</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@titipin.me"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-charcoal text-cream hover:bg-charcoal-80 font-bold h-12"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Masuk"}
          </Button>
        </form>
      </div>
    </div>
  );
}
