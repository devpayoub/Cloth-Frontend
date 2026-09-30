"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ViewTransition } from "react";
import type { Product } from "@/types";
import { ROUTES } from "@/constants";
import { formatPrice } from "@/utils";

type ProductCardProps = {
  product: Product;
  /** Position in the grid, used to stagger the reveal. */
  index?: number;
  /**
   * Shared-element morph identity, e.g. `product-<slug>`. Only set it on ONE
   * instance per page — duplicate names on simultaneously mounted components
   * break view transitions.
   */
  viewTransitionName?: string;
};

export function ProductCard({
  product,
  index = 0,
  viewTransitionName,
}: ProductCardProps) {
  const [primaryImage, hoverImage] = product.images;

  const imageContainer = (
    <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
      <Image
        src={primaryImage}
        alt={product.name}
        fill
        sizes="(min-width: 640px) 25vw, 50vw"
        className="object-cover transition-[opacity,transform] duration-500 ease-in-out group-hover:scale-105 group-hover:opacity-0"
      />
      {hoverImage && (
        <Image
          src={hoverImage}
          alt=""
          fill
          sizes="(min-width: 640px) 25vw, 50vw"
          className="object-cover opacity-0 transition-[opacity,transform] duration-500 ease-in-out group-hover:scale-105 group-hover:opacity-100"
        />
      )}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-wrap items-center justify-center gap-3 bg-white/90 py-3 opacity-0 translate-y-2 transition-[opacity,transform] duration-500 ease-in-out group-hover:opacity-100 group-hover:translate-y-0">
        {product.sizes.map((size) => (
          <span key={size} className="text-xs font-medium text-neutral-900">
            {size}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link
        href={ROUTES.product(product.slug)}
        transitionTypes={["nav-forward"]}
        className="group flex flex-col"
      >
        {viewTransitionName ? (
          <ViewTransition name={viewTransitionName} share="morph" default="none">
            {imageContainer}
          </ViewTransition>
        ) : (
          imageContainer
        )}
        <div className="mt-4 flex flex-col text-sm">
          <span className="font-medium text-neutral-900">{product.name}</span>
          <span className="text-neutral-500">
            {formatPrice(product.price, product.currency)}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
