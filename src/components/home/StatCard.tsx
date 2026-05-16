import React from "react";

interface StatCardProps {
  icon: React.ReactNode;
  iconBgClass: string;
  label: string;
  value: string | number;
  delta?: {
    value: string;
    isUp: boolean;
  };
  onClick?: () => void;
}

export function StatCard({ icon, iconBgClass, label, value, delta, onClick }: StatCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`stat-card bg-elevated rounded-xl shadow-sm border border-subtle p-5 flex flex-col gap-3 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className={`stat-icon w-10 h-10 rounded-md flex items-center justify-center text-[19px] ${iconBgClass}`}>
        {icon}
      </div>
      <div className="stat-info">
        <div className="stat-label text-[11px] font-semibold tracking-wide text-charcoal-60 mb-1">
          {label}
        </div>
        <div className="stat-value font-display text-[32px] font-light text-charcoal leading-none mb-2">
          {value}
        </div>
        {delta && (
          <div className={`stat-delta text-[11px] font-semibold flex items-center gap-1 ${delta.isUp ? 'text-sage-dark' : 'text-terracotta'}`}>
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {delta.isUp ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              )}
            </svg>
            {delta.value}
          </div>
        )}
      </div>
    </div>
  );
}
