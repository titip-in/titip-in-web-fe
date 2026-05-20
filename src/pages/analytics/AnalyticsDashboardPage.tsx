import React, { useState } from "react";
import {
  BarChart2, TrendingUp, MousePointerClick, Eye, Lock, ArrowLeft,
  AlertCircle, ChevronUp, Flame
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useAnalytics } from "@/hooks/useAnalytics";
import { AnalyticsItemDetail } from "@/types/api";

// ── Helpers ──────────────────────────────────────────────────────────

function StatCard({
  label, value, icon: Icon, color, bg, isLoading
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  bg: string;
  isLoading?: boolean;
}) {
  return (
    <div className="relative overflow-hidden bg-elevated rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-subtle transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-2xl ${bg} bg-opacity-15 ${color} flex items-center justify-center shadow-sm`}>
          <Icon size={24} strokeWidth={2.5} />
        </div>
      </div>
      <div className="text-[14px] text-charcoal-50 font-medium mb-1.5">{label}</div>
      {isLoading ? (
        <div className="h-10 w-24 bg-charcoal-10 animate-pulse rounded-lg" />
      ) : (
        <div className="text-[34px] font-bold text-charcoal tracking-tight leading-none">{value}</div>
      )}
      {/* Decorative gradient blur in corner */}
      <div className={`absolute -bottom-8 -right-8 w-32 h-32 ${bg} opacity-20 blur-3xl rounded-full pointer-events-none`} />
    </div>
  );
}

function ConversionBar({ rate }: { rate: number | null }) {
  const pct = rate != null ? Math.min(100, Math.round(rate)) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-charcoal-10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[12px] font-semibold text-charcoal-60 w-10 text-right">
        {rate != null ? `${rate.toFixed(1)}%` : "—"}
      </span>
    </div>
  );
}

function ItemTable({ items, isPro }: { items: AnalyticsItemDetail[]; isPro: boolean }) {
  const [sortField, setSortField] = useState<"views" | "clicks" | "conversion_rate">("views");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");

  const sorted = [...items].sort((a, b) => {
    const va = (a[sortField] ?? 0) as number;
    const vb = (b[sortField] ?? 0) as number;
    return sortDir === "desc" ? vb - va : va - vb;
  });

  const toggle = (f: typeof sortField) => {
    if (sortField === f) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortField(f); setSortDir("desc"); }
  };

  const SortBtn = ({ field, label }: { field: typeof sortField; label: string }) => (
    <button
      onClick={() => toggle(field)}
      className={`inline-flex items-center justify-end gap-1 text-[12px] font-semibold transition-colors w-full ${sortField === field ? "text-violet-600" : "text-charcoal-50 hover:text-charcoal"}`}
    >
      {label}
      {sortField === field && (
        <ChevronUp size={12} className={sortDir === "asc" ? "rotate-0" : "rotate-180"} />
      )}
    </button>
  );

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-charcoal-40">
        <BarChart2 size={40} className="mx-auto mb-3 opacity-40" />
        <p className="text-[14px]">Belum ada data item. Mulai pasang listing dan tunggu engagement!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-subtle">
            <th className="text-left pb-3 text-[12px] font-semibold text-charcoal-50 pr-4">Item</th>
            <th className="pb-3 pr-4 text-right"><SortBtn field="views" label="Tayangan" /></th>
            <th className="pb-3 pr-4 text-right"><SortBtn field="clicks" label="Klik WA" /></th>
            {isPro && <th className="pb-3 text-right"><SortBtn field="conversion_rate" label="Konversi" /></th>}
          </tr>
        </thead>
        <tbody>
          {sorted.map((item, i) => (
            <tr key={item.id} className={`border-b border-subtle/40 hover:bg-charcoal-5 transition-colors group ${i === 0 && sortDir === "desc" ? "bg-violet-50/30" : ""}`}>
              <td className="py-4 pr-4">
                <div className="font-bold text-[15px] text-charcoal line-clamp-1 group-hover:text-violet-700 transition-colors">{item.title}</div>
                <div className="text-[10px] font-bold text-charcoal-40 mt-1 uppercase tracking-wider flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${item.type?.includes('jastip') ? 'bg-amber-400' : 'bg-sage'}`}></div>
                  {item.type ? item.type.replace(/_/g, " ") : "Item"}
                </div>
              </td>
              <td className="py-4 pr-4">
                <div className="flex justify-end">
                  <div className="inline-flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full text-blue-700">
                    <Eye size={14} className="opacity-70" />
                    <span className="font-bold text-[14px]">{(item.views || 0).toLocaleString()}</span>
                  </div>
                </div>
              </td>
              <td className="py-4 pr-4">
                <div className="flex justify-end">
                  <div className="inline-flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full text-green-700">
                    <MousePointerClick size={14} className="opacity-70" />
                    <span className="font-bold text-[14px]">{(item.clicks || 0).toLocaleString()}</span>
                  </div>
                </div>
              </td>
              {isPro && (
                <td className="py-4 w-40">
                  <ConversionBar rate={item.conversion_rate} />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────

export default function AnalyticsDashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const tier = user?.tier ?? "basic";
  const isPro = tier === "pro";

  const { data, isLoading, isError, error } = useAnalytics();

  // Basic tier — paywall
  if (tier === "basic") {
    return (
      <div className="max-w-[800px] mx-auto py-20 px-6 text-center animate-fade-in flex flex-col items-center">
        <div className="w-20 h-20 bg-violet-50 rounded-full flex items-center justify-center text-violet-400 mb-6">
          <Lock size={40} />
        </div>
        <h1 className="font-display text-[28px] font-medium text-charcoal mb-3">Fitur Terkunci</h1>
        <p className="text-[15px] text-charcoal-60 mb-8 max-w-md">
          Dashboard Analitik hanya tersedia untuk pengguna <strong>Titip Plus</strong> dan <strong>Titip Pro</strong>. Upgrade akun Anda untuk memantau performa listing.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/profile")}
            className="btn rounded-full border border-charcoal-30 text-charcoal hover:bg-charcoal-10 font-medium px-8 py-3 transition-colors"
          >
            Kembali ke Profil
          </button>
          <button
            onClick={() => { navigate("/profile"); }}
            className="btn rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 text-white font-medium px-8 py-3 hover:opacity-90 transition-opacity"
          >
            ✨ Upgrade Sekarang
          </button>
        </div>
      </div>
    );
  }

  // 403 from API means backend also enforces tier gate
  if (isError) {
    const errMsg = (error as any)?.response?.data?.message || "Gagal memuat analitik.";
    return (
      <div className="max-w-[800px] mx-auto py-20 px-6 text-center animate-fade-in flex flex-col items-center">
        <div className="w-20 h-20 bg-terracotta-pale rounded-full flex items-center justify-center text-terracotta mb-6">
          <AlertCircle size={40} />
        </div>
        <h1 className="font-display text-[24px] font-medium text-charcoal mb-3">Tidak Dapat Memuat Data</h1>
        <p className="text-[15px] text-charcoal-60 mb-6 max-w-md">{errMsg}</p>
        <button onClick={() => navigate("/profile")} className="btn rounded-full bg-charcoal text-cream font-medium px-8 py-3">
          Kembali ke Profil
        </button>
      </div>
    );
  }

  const bestItem = isPro ? data?.best_item : undefined;

  return (
    <div className="max-w-[1000px] mx-auto py-8 animate-fade-in pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/profile")}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-charcoal-10 hover:bg-charcoal-20 transition-colors text-charcoal"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-display text-[32px] font-medium text-charcoal leading-tight">Analitik Performa</h1>
          <p className="text-[15px] text-charcoal-60">Pantau performa listing Anda bulan ini.</p>
        </div>
        {isPro && (
          <span className="ml-auto text-[11px] bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold px-3 py-1 rounded-full">
            ⚡ Pro
          </span>
        )}
      </div>

      {/* Stats Grid */}
      <div className={`grid grid-cols-2 ${isPro ? "lg:grid-cols-4" : "lg:grid-cols-2"} gap-4 mb-8`}>
        <StatCard label="Total Tayangan" value={data?.total_views?.toLocaleString() ?? "0"} icon={Eye} color="text-blue-500" bg="bg-blue-50" isLoading={isLoading} />
        <StatCard label="Total Klik WA" value={data?.total_clicks?.toLocaleString() ?? "0"} icon={MousePointerClick} color="text-green-500" bg="bg-green-50" isLoading={isLoading} />
        {isPro && (
          <>
            <StatCard label="Listing Terlacak" value={data?.item_details?.length ?? "0"} icon={BarChart2} color="text-violet-500" bg="bg-violet-50" isLoading={isLoading} />
            <StatCard
              label="Rata-rata Konversi"
              value={
                data?.item_details?.length
                  ? `${(data.item_details.reduce((s, i) => s + (i.conversion_rate ?? 0), 0) / data.item_details.length).toFixed(1)}%`
                  : "0%"
              }
              icon={TrendingUp}
              color="text-amber-500"
              bg="bg-amber-50"
              isLoading={isLoading}
            />
          </>
        )}
      </div>

      {/* Pro: Best Item highlight */}
      {isPro && bestItem && (
        <div className="mb-8 relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-1 shadow-lg shadow-orange-500/20 group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="bg-white/95 backdrop-blur-md rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10 transition-transform group-hover:scale-[0.995]">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shrink-0 shadow-md transform -rotate-6">
              <TrendingUp size={28} strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-black uppercase tracking-widest text-orange-500 mb-1 flex items-center gap-1.5">
                <Flame size={14} fill="currentColor" /> Listing Performa Terbaik
              </div>
              <div className="font-display font-bold text-charcoal text-[22px] line-clamp-1 mb-1">{bestItem.title}</div>
              <div className="text-[12px] font-bold text-charcoal-40 uppercase tracking-wider">{bestItem.type?.replace(/_/g, " ") || "Item"}</div>
            </div>
            <div className="flex gap-8 text-center shrink-0">
              <div className="flex flex-col items-center">
                <div className="text-[28px] font-bold text-blue-600 leading-none mb-1">{(bestItem.views || 0).toLocaleString()}</div>
                <div className="text-[12px] font-medium text-charcoal-50 uppercase tracking-wide">Tayangan</div>
              </div>
              <div className="w-px h-12 bg-subtle"></div>
              <div className="flex flex-col items-center">
                <div className="text-[28px] font-bold text-green-600 leading-none mb-1">{(bestItem.clicks || 0).toLocaleString()}</div>
                <div className="text-[12px] font-medium text-charcoal-50 uppercase tracking-wide">Klik WA</div>
              </div>
              <div className="w-px h-12 bg-subtle"></div>
              <div className="flex flex-col items-center">
                <div className="text-[28px] font-bold text-orange-500 leading-none mb-1">{bestItem.conversion_rate?.toFixed(1) ?? "—"}%</div>
                <div className="text-[12px] font-medium text-charcoal-50 uppercase tracking-wide">Konversi</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Table */}
      <div className="bg-elevated border border-subtle rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
        {/* Subtle background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-charcoal-5 text-charcoal-60 flex items-center justify-center">
            <BarChart2 size={20} />
          </div>
          <div>
            <h2 className="font-display text-[22px] font-medium text-charcoal leading-none">Detail Per Listing</h2>
            {!isLoading && data?.item_details && (
              <span className="text-[13px] text-charcoal-50 mt-1 block">
                Menampilkan data dari {data.item_details.length} listing aktif
              </span>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-charcoal-10 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <ItemTable items={data?.item_details ?? []} isPro={isPro} />
        )}

        {/* Pro lock overlay if Plus */}
        {tier === "plus" && !isLoading && (
          <div className="mt-4 pt-4 border-t border-subtle flex items-center gap-3 text-[13px] text-charcoal-50">
            <Lock size={14} className="shrink-0" />
            <span>Kolom <strong className="text-charcoal">Tingkat Konversi</strong> dan kartu <strong className="text-charcoal">Listing Terbaik</strong> tersedia di Titip Pro.</span>
          </div>
        )}
      </div>
    </div>
  );
}
