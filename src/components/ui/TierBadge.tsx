import React from "react";
import { UserTier } from "@/types/api";
import { Zap, Sparkles } from "lucide-react";

interface TierBadgeProps {
  tier: UserTier;
  size?: "xs" | "sm" | "md";
  showBasic?: boolean; // by default Basic doesn't show a badge
}

const TIER_CONFIG: Record<
  UserTier,
  { label: string; gradient: string; textColor: string; Icon?: React.ElementType } | null
> = {
  basic: null,
  plus: {
    label: "Plus",
    gradient: "from-violet-500 to-indigo-500",
    textColor: "text-white",
    Icon: Sparkles,
  },
  pro: {
    label: "Pro",
    gradient: "from-amber-400 to-orange-500",
    textColor: "text-white",
    Icon: Zap,
  },
};

const SIZE_CLASSES = {
  xs: { wrapper: "px-1.5 py-0.5 rounded text-[9px] gap-0.5", icon: 8 },
  sm: { wrapper: "px-2 py-0.5 rounded-md text-[10px] gap-1", icon: 10 },
  md: { wrapper: "px-3 py-1 rounded-lg text-[12px] gap-1.5", icon: 13 },
};

export function TierBadge({ tier, size = "sm", showBasic = false }: TierBadgeProps) {
  const config = TIER_CONFIG[tier];

  // Basic user — show nothing by default
  if (!config) {
    if (!showBasic) return null;
    return (
      <span
        className={`inline-flex items-center font-semibold tracking-wide bg-charcoal-10 text-charcoal-60 ${SIZE_CLASSES[size].wrapper}`}
      >
        Basic
      </span>
    );
  }

  const { label, gradient, textColor, Icon } = config;
  const { wrapper, icon: iconSize } = SIZE_CLASSES[size];

  return (
    <span
      className={`inline-flex items-center font-bold tracking-wide bg-gradient-to-r ${gradient} ${textColor} ${wrapper} shadow-sm`}
    >
      {Icon && <Icon size={iconSize} fill="currentColor" className="shrink-0" />}
      {label}
    </span>
  );
}
