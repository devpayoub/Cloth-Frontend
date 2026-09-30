"use client";

import { motion } from "motion/react";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types";

type ProductGridProps = {
  products: Product[];
  /** Enable shared-element morph names on the cards (one grid per page). */
  morph?: boolean;
};

export function ProductGrid({ products, morph }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-32 text-center">
        <p className="font-display text-4xl tracking-wide text-neutral-300">
          Nothing here yet
        </p>
        <p className="text-sm text-neutral-500">
          New pieces are on their way. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-1 gap-y-10 sm:grid-cols-4 sm:gap-x-1">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          viewTransitionName={morph ? `product-${product.slug}` : undefined}
        />
      ))}
    </div>
  );
}
