"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Search, X } from "lucide-react";
import { ROUTES } from "@/constants";
import { formatPrice } from "@/utils";
import type { Product } from "@/types";

type NavbarSearchProps = {
  products: Product[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function NavbarSearch({ products, open, onOpenChange }: NavbarSearchProps) {
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on navigation, focus the field when opening, Escape / outside click close.
  useEffect(() => {
    onOpenChange(false);
    setQuery("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onOpenChange(false);
    }
    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        onOpenChange(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, onOpenChange]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((product) =>
        [product.name, product.category, ...product.tags]
          .join(" ")
          .toLowerCase()
          .includes(q)
      )
      .slice(0, 5);
  }, [products, query]);

  return (
    <div ref={containerRef} className="relative flex items-center">
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="input"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "13rem", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              className="w-full border-b border-current/40 bg-transparent pb-1 text-sm tracking-wide outline-none placeholder:text-neutral-400"
            />
          </motion.div>
        ) : (
          <button
            key="icon"
            type="button"
            aria-label="Search"
            aria-expanded={open}
            onClick={() => onOpenChange(true)}
            className="transition-opacity hover:opacity-60"
          >
            <Search className="h-5 w-5" strokeWidth={1.5} />
          </button>
        )}
      </AnimatePresence>

      {open && (
        <button
          type="button"
          aria-label="Close search"
          onClick={() => onOpenChange(false)}
          className="ml-2 shrink-0 transition-opacity hover:opacity-60"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>
      )}

      <AnimatePresence>
        {open && query.trim() !== "" && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full z-30 mt-3 w-80 border border-neutral-200 bg-white text-black shadow-lg"
          >
            {results.length === 0 ? (
              <p className="px-5 py-4 text-sm text-neutral-500">
                No results for “{query.trim()}”
              </p>
            ) : (
              <ul className="divide-y divide-neutral-100">
                {results.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={ROUTES.product(product.slug)}
                      transitionTypes={["nav-forward"]}
                      onClick={() => onOpenChange(false)}
                      className="flex items-center gap-4 px-5 py-3 transition-opacity hover:opacity-60"
                    >
                      <span className="relative aspect-[4/5] w-10 shrink-0 overflow-hidden bg-neutral-100">
                        <Image
                          src={product.images[0]}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </span>
                      <span className="flex-1 text-sm">{product.name}</span>
                      <span className="text-sm text-neutral-500">
                        {formatPrice(product.price, product.currency)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
