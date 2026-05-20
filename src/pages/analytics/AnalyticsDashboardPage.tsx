import React from "react";
import { BarChart2, TrendingUp, Users, MousePointerClick, Lock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export default function AnalyticsDashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);

  // If user is basic somehow bypassed the UI, we show a locked screen
  if (user?.tier === 'basic') {
    return (
      <div className="max-w-[800px] mx-auto py-20 px-6 text-center animate-fade-in flex flex-col items-center">
        <div className="w-20 h-20 bg-charcoal-10 rounded-full flex items-center justify-center text-charcoal-40 mb-6">
          <Lock size={40} />
        </div>
        <h1 className="font-display text-[28px] font-medium text-charcoal mb-4">Fitur Terkunci</h1>
        <p className="text-[15px] text-charcoal-60 mb-8 max-w-md">
          Dashboard Analitik hanya tersedia untuk pengguna Titip Plus dan Titip Pro. Hubungi admin untuk upgrade akun Anda.
        </p>
        <button 
          onClick={() => navigate('/profile')}
          className="btn rounded-full bg-charcoal text-cream font-medium px-8 py-3"
        >
          Kembali ke Profil
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto py-8 animate-fade-in pb-20">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/profile')}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-charcoal-10 hover:bg-charcoal-20 transition-colors text-charcoal"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-display text-[32px] font-medium text-charcoal leading-tight">Analitik Performa</h1>
          <p className="text-[15px] text-charcoal-60">Pantau performa listing Anda bulan ini.</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 mb-8 flex gap-3 text-violet-800 text-[14px]">
        <BarChart2 className="shrink-0 mt-0.5" size={20} />
        <div>
          <strong>Fitur Segera Hadir!</strong> Data analitik saat ini sedang dalam pengembangan oleh tim backend. 
          Tampilan di bawah ini adalah preview dari fitur analitik yang akan datang.
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Tayangan", value: "--", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Total Klik WA", value: "--", icon: MousePointerClick, color: "text-green-500", bg: "bg-green-50" },
          { label: "Listing Aktif", value: "--", icon: BarChart2, color: "text-violet-500", bg: "bg-violet-50" },
          { label: "Tingkat Konversi", value: "--", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-elevated border border-subtle rounded-xl p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon size={20} />
            </div>
            <div className="text-[13px] text-charcoal-60 font-medium mb-1">{stat.label}</div>
            <div className="text-[28px] font-bold text-charcoal leading-none">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-elevated border border-subtle rounded-xl p-6 shadow-sm min-h-[300px] flex flex-col justify-center items-center text-center">
          <BarChart2 size={48} className="text-charcoal-20 mb-4" />
          <h3 className="font-display text-[18px] font-medium text-charcoal mb-2">Grafik Kunjungan</h3>
          <p className="text-charcoal-50 text-[14px] max-w-sm">Data grafik akan muncul di sini setelah update backend dirilis.</p>
        </div>

        {/* Pro Feature Placeholder */}
        <div className="bg-elevated border border-subtle rounded-xl p-6 shadow-sm min-h-[300px] relative overflow-hidden flex flex-col justify-center items-center text-center">
          {user?.tier !== 'pro' && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-6">
              <Lock size={32} className="text-charcoal-40 mb-3" />
              <div className="text-[14px] font-bold text-charcoal mb-1">Khusus Titip Pro</div>
              <div className="text-[12px] text-charcoal-60 mb-4">Upgrade ke Pro untuk melihat listing terbaik Anda.</div>
            </div>
          )}
          
          <TrendingUp size={48} className="text-charcoal-20 mb-4" />
          <h3 className="font-display text-[18px] font-medium text-charcoal mb-2">Listing Terbaik</h3>
          <p className="text-charcoal-50 text-[14px]">Analisa performa per-listing.</p>
        </div>
      </div>
    </div>
  );
}
