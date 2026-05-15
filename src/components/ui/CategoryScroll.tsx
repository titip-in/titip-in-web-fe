import React from "react";
import { useCategories } from "@/hooks/useCategory";

interface CategoryScrollProps {
  type?: 'jastip' | 'preloved';
  selectedId?: number | null;
  onSelect?: (id: number | null) => void;
}

export function CategoryScroll({ type, selectedId, onSelect }: CategoryScrollProps) {
  const { data: categories, isLoading } = useCategories();

  if (isLoading || !categories || categories.length === 0) return null;

  const filteredCategories = categories;

  if (filteredCategories.length === 0) return null;

  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 mb-6">
      <button
        onClick={() => onSelect?.(null)}
        className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
          selectedId === null
            ? 'bg-charcoal text-white border-charcoal'
            : 'bg-white text-charcoal-60 border-subtle hover:bg-cream-dark'
        }`}
      >
        Semua Kategori
      </button>
      {filteredCategories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect?.(cat.id)}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
            selectedId === cat.id
              ? 'bg-sage text-white border-sage'
              : 'bg-white text-charcoal-60 border-subtle hover:bg-sage/5 hover:border-sage/30'
          }`}
        >
          {cat.icon && <span className="mr-2">{cat.icon}</span>}
          {cat.name}
        </button>
      ))}
    </div>
  );
}
