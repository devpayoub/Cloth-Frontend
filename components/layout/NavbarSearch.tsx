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
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on navigation, focus the field when opening, Escape closes.
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
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) =>
        [p.name, p.category, ...p.tags]
          .join(" ")
          .toLowerCase()
          .includes(q)
      )
      .slice(0, 5);
  }, [query]);

  return (
    <>
      <button
        type="button"
        aria-label="Search"
        aria-expanded={open}
        onClick={() => onOpenChange(true)}
        className="transition-opacity hover:opacity-60"
      >
        <Search className="h-5 w-5" strokeWidth={1.5} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Click anywhere outside the bar to close */}
            <button
              type="button"
              aria-label="Close search"
              onClick={() => onOpenChange(false)}
              className="fixed inset-0 -z-10 cursor-default"
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-20 bg-white text-black"
            >
              <div className="mx-auto flex h-full max-w-7xl items-center gap-4 px-6 sm:px-10">
                <Search
                  className="h-5 w-5 shrink-0 text-neutral-400"
                  strokeWidth={1.5}
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  exit={{ width: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products…"
                    className="w-full bg-transparent text-sm tracking-wide outline-none placeholder:text-neutral-400"
                  />
                </motion.div>
                <button
                  type="button"
                  aria-label="Close search"
                  onClick={() => onOpenChange(false)}
                  className="shrink-0 transition-opacity hover:opacity-60"
                >
                  <X className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>

              {query.trim() !== "" && (
                <div className="absolute inset-x-0 top-full border-t border-neutral-200 bg-white">
                  <div className="mx-auto max-w-7xl px-6 sm:px-10">
                    {results.length === 0 ? (
                      <p className="py-6 text-sm text-neutral-500">
                        No results for “{query.trim()}”
                      </p>
                    ) : (
                      <ul className="divide-y divide-neutral-100 py-2">
                        {results.map((product) => (
                          <li key={product.id}>
                            <Link
                              href={ROUTES.product(product.slug)}
                              transitionTypes={["nav-forward"]}
                              onClick={() => onOpenChange(false)}
                              className="flex items-center gap-4 py-3 transition-opacity hover:opacity-60"
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
                              <span className="flex-1 text-sm">
                                {product.name}
                              </span>
                              <span className="text-sm text-neutral-500">
                                {formatPrice(product.price, product.currency)}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
