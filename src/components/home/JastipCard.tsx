import React from "react";

interface JastipCardProps {
  user: {
    name: string;
    avatarClass: string;
    avatarInitial: string;
  };
  timeAgo: string;
  status: "Aktif" | "Pending";
  route: {
    from: string;
    to: string;
  };
  tags: string[];
  deadline: string;
  actionText: string;
}

export function JastipCard({ user, timeAgo, status, route, tags, deadline, actionText }: JastipCardProps) {
  return (
    <div className="jcard bg-elevated rounded-xl shadow-sm border border-subtle p-5 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <div className="jcard-top flex justify-between items-start mb-3">
        <div className="jcard-user flex items-center gap-3">
          <div className={`jcard-avatar w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold text-white shrink-0 ${user.avatarClass}`}>
            {user.avatarInitial}
          </div>
          <div>
            <div className="jcard-name text-[14px] font-semibold text-charcoal">{user.name}</div>
            <div className="jcard-meta text-[11px] text-charcoal-60 mt-[1px]">Dibuat {timeAgo}</div>
          </div>
        </div>
        <div className={`status-pill inline-flex items-center gap-1 py-1 px-3 rounded-full text-[10px] font-bold tracking-wide uppercase ${status === 'Aktif' ? 'bg-sage-pale text-sage-dark' : 'bg-gold-pale text-gold-dark'}`}>
          <div className="w-[5px] h-[5px] rounded-full bg-current"></div>
          {status}
        </div>
      </div>

      <div className="jcard-route flex items-center gap-2 mb-3">
        <span className="jcard-place text-[16px] font-bold text-charcoal">{route.from}</span>
        <svg className="jcard-arrow text-[14px] text-charcoal-30 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
        </svg>
        <span className="jcard-place text-[16px] font-bold text-charcoal">{route.to}</span>
      </div>

      <div className="jcard-tags flex gap-2 flex-wrap mb-4">
        {tags.map((tag, idx) => (
          <span key={idx} className="tag-pill bg-cream-dark rounded-full py-1 px-3 text-[11px] text-charcoal-60 font-medium flex items-center gap-1">
            {tag}
          </span>
        ))}
      </div>

      <div className="jcard-footer flex justify-between items-center pt-3 border-t border-subtle">
        <div className="jcard-deadline text-[12px] text-charcoal-60 font-medium">
          Berangkat: <span className="text-charcoal font-semibold">{deadline}</span>
        </div>
        <button className="btn btn-sm btn-outline rounded-full text-[12px] font-semibold border-1.5 border-charcoal-30 text-charcoal py-2 px-4 hover:border-charcoal hover:bg-charcoal-10 transition-colors">
          {actionText}
        </button>
      </div>
    </div>
  );
}
