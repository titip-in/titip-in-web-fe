import React from "react";
import { Zap, Sparkles, Check, MessageCircle } from "lucide-react";
import { UserTier, TIER_LIMITS, TIER_BOOST_QUOTA } from "@/types/api";

interface UpgradePlanBannerProps {
  currentTier: UserTier;
}

const PLANS = [
  {
    tier: "basic" as UserTier,
    label: "Basic",
    price: "Gratis",
    gradient: "from-charcoal-10 to-charcoal-10",
    headerBg: "bg-charcoal-10",
    headerText: "text-charcoal-60",
    borderClass: "border-charcoal-20",
    features: [
      `${TIER_LIMITS.basic} item aktif per kategori`,
      "Fitur dasar listing & request",
      "Chat via WhatsApp",
    ],
    notIncluded: ["Badge tier", "Boost listing", "Analitik"],
  },
  {
    tier: "plus" as UserTier,
    label: "Plus",
    price: "Hubungi Admin",
    gradient: "from-violet-500 to-indigo-500",
    headerBg: "bg-gradient-to-br from-violet-500 to-indigo-500",
    headerText: "text-white",
    borderClass: "border-violet-300",
    highlight: true,
    Icon: Sparkles,
    features: [
      `${TIER_LIMITS.plus} item aktif per kategori`,
      `${TIER_BOOST_QUOTA.plus} boost quota per bulan`,
      "Badge ✨ Plus di listing",
      "Analitik: views & klik WA",
    ],
    notIncluded: ["Listing terbaik & konversi"],
  },
  {
    tier: "pro" as UserTier,
    label: "Pro",
    price: "Hubungi Admin",
    gradient: "from-amber-400 to-orange-500",
    headerBg: "bg-gradient-to-br from-amber-400 to-orange-500",
    headerText: "text-white",
    borderClass: "border-amber-300",
    Icon: Zap,
    features: [
      `${TIER_LIMITS.pro} item aktif per kategori`,
      `${TIER_BOOST_QUOTA.pro} boost quota per bulan`,
      "Badge ⚡ Pro di listing",
      "Analitik lengkap + konversi",
      "Kuota foto lebih banyak",
    ],
    notIncluded: [],
  },
];

const TIER_ORDER: Record<UserTier, number> = {
  basic: 0,
  plus: 1,
  pro: 2,
};

export function UpgradePlanBanner({ currentTier }: UpgradePlanBannerProps) {
  const waMessage = encodeURIComponent(
    `Halo admin Titip.in, saya ingin upgrade akun saya dari tier ${currentTier.toUpperCase()} ke tier yang lebih tinggi. Mohon bantuannya 🙏`
  );
  const waLink = `https://wa.me/6281234567890?text=${waMessage}`; // replace with actual support WA

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <h2 className="font-display text-[20px] font-medium text-charcoal">
          Upgrade Plan
        </h2>
        {currentTier !== "pro" && (
          <span className="text-[11px] bg-gradient-to-r from-violet-500 to-orange-400 text-white font-bold px-2 py-0.5 rounded-full">
            Buka Lebih Banyak Fitur
          </span>
        )}
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {PLANS.map((plan) => {
          const isCurrent = plan.tier === currentTier;
          const canUpgrade = TIER_ORDER[plan.tier] > TIER_ORDER[currentTier];

          return (
            <div
              key={plan.tier}
              className={`relative rounded-xl border-2 overflow-hidden transition-all duration-200 ${
                isCurrent
                  ? "border-sage-dark shadow-md"
                  : plan.highlight
                  ? `${plan.borderClass} shadow-lg shadow-violet-100`
                  : `${plan.borderClass}`
              }`}
            >
              {/* "Recommended" ribbon for Plus when user is Basic */}
              {plan.tier === "plus" && currentTier === "basic" && (
                <div className="absolute top-2 right-2 bg-violet-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wide uppercase">
                  Populer
                </div>
              )}

              {/* Header */}
              <div className={`${plan.headerBg} px-4 pt-4 pb-3`}>
                <div className={`flex items-center gap-1.5 font-bold text-[15px] ${plan.headerText}`}>
                  {plan.Icon && <plan.Icon size={14} fill="currentColor" />}
                  Titip {plan.label}
                </div>
                <div className={`text-[11px] mt-0.5 font-medium ${plan.headerText} opacity-90`}>
                  {plan.price}
                </div>
              </div>

              {/* Features */}
              <div className="px-4 py-3 space-y-1.5 bg-elevated">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-[12px] text-charcoal">
                    <Check size={12} className="text-sage-dark mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
                {plan.notIncluded.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-[12px] text-charcoal-30 line-through">
                    <span className="w-3 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="px-4 pb-4 bg-elevated">
                {isCurrent ? (
                  <div className="text-center text-[11px] text-sage-dark bg-sage-pale border border-sage-dark/30 font-bold py-1.5 rounded-lg">
                    Plan Saat Ini
                  </div>
                ) : canUpgrade ? (
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-1.5 w-full text-[12px] font-semibold py-1.5 rounded-lg text-white transition-opacity hover:opacity-90 ${plan.headerBg}`}
                  >
                    <MessageCircle size={13} />
                    Upgrade
                  </a>
                ) : (
                  <div className="text-center text-[11px] text-charcoal-40 font-medium py-1.5 border border-charcoal-20 bg-charcoal-10 rounded-lg">
                    Tersedia
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-charcoal-40 mt-3 text-center">
        Upgrade dilakukan secara manual oleh admin. Hubungi kami via WhatsApp untuk info lebih lanjut.
      </p>
    </div>
  );
}
