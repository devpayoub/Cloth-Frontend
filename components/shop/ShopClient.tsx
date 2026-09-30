"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ProductGrid } from "@/components/product/ProductGrid";
import type { Category, Product, SortOption } from "@/types";
import { cn } from "@/utils";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price — Low to High" },
  { value: "price-desc", label: "Price — High to Low" },
  { value: "rating", label: "Top Rated" },
];

type ShopClientProps = {
  products: Product[];
  categories: Category[];
};

export function ShopClient({ products, categories }: ShopClientProps) {
  const [category, setCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const filtered = useMemo(() => {
    const list = category
      ? products.filter((product) => product.category === category)
      : products;
    const sorted = [...list];
    switch (sortBy) {
      case "price-asc":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-desc":
        return sorted.sort((a, b) => b.price - a.price);
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "newest":
      default:
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  }, [products, category, sortBy]);

  return (
    <section className="px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 border-b border-neutral-200 pb-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            <FilterPill
              label="All"
              active={category === null}
              onClick={() => setCategory(null)}
            />
            {categories.map((cat) => (
              <FilterPill
                key={cat.slug}
                label={cat.name}
                active={category === cat.slug}
                onClick={() => setCategory(cat.slug)}
              />
            ))}
          </div>

          <label className="flex items-center gap-3 text-xs uppercase tracking-widest text-neutral-500">
            Sort
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="border border-neutral-300 bg-white px-3 py-2 text-xs uppercase tracking-widest text-black outline-none transition-colors hover:border-black focus:border-black"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <motion.div
          key={`${category ?? "all"}-${sortBy}`}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="pt-12"
        >
          <ProductGrid products={filtered} morph />
        </motion.div>
      </div>
    </section>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "border px-4 py-2 text-xs uppercase tracking-widest transition-colors",
        active
          ? "border-black bg-black text-white"
          : "border-neutral-300 text-neutral-600 hover:border-black hover:text-black"
      )}
    >
      {label}
    </button>
  );
}
