import React from "react";

interface ActivityItem {
  dotClass: string;
  title: React.ReactNode;
  time: string;
}

interface ActivityFeedProps {
  items: ActivityItem[];
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <div className="activity-feed bg-elevated rounded-xl shadow-sm border border-subtle overflow-hidden">
      <div className="activity-header py-4 px-5 border-b border-subtle flex justify-between items-center">
        <h3 className="activity-title font-display text-[16px] font-medium text-charcoal">Aktivitas Terkini</h3>
        <button className="text-[12px] font-semibold text-terracotta hover:text-terracotta-dark transition-colors">
          Lihat Semua
        </button>
      </div>
      <div className="activity-list py-3 px-5">
        {items.map((item, idx) => (
          <div key={idx} className="activity-item flex items-start gap-3 py-3 border-b border-subtle last:border-b-0">
            <div className={`activity-dot w-2 h-2 rounded-full shrink-0 mt-[5px] ${item.dotClass}`}></div>
            <div className="activity-text flex-1">
              <div className="activity-text-title text-[13px] font-medium text-charcoal leading-[1.3]">
                {item.title}
              </div>
              <div className="activity-text-sub text-[11px] text-charcoal-60 mt-[1px]">
                {item.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
