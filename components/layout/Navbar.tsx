"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import { useScrolled } from "@/hooks";
import { ROUTES, SITE_CONFIG } from "@/constants";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { NavbarSearch } from "@/components/layout/NavbarSearch";
import { cn } from "@/utils";
import type { Product } from "@/types";

const LEFT_LINKS = [
  { label: "Home", href: ROUTES.home },
  { label: "Catalog", href: ROUTES.shop },
  { label: "Contact", href: "/contact" },
];

type NavbarProps = {
  products: Product[];
};

export function Navbar({ products }: NavbarProps) {
  const scrolled = useScrolled(40);
  const pathname = usePathname();
  const isHome = pathname === ROUTES.home;
  const solid = scrolled || !isHome;
  const { count } = useCart();
  const { state: authState } = useAuth();
  const accountHref =
    authState.status === "authenticated" ? "/account/profile" : ROUTES.account;
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-in-out",
        solid ? "bg-white/80 text-black backdrop-blur-md" : "bg-transparent text-white"
      )}
    >
      <nav className="mx-auto grid h-20 max-w-7xl grid-cols-3 items-center px-6 lg:px-10">
        {/* Desktop links / mobile hamburger */}
        <div className="hidden items-center gap-8 text-sm font-medium tracking-wide md:flex">
          {LEFT_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              transitionTypes={
                link.href === ROUTES.home && !isHome ? ["nav-back"] : ["nav-forward"]
              }
              className="transition-opacity hover:opacity-60"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center md:hidden">
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="transition-opacity hover:opacity-60"
          >
            {menuOpen ? (
              <X className="h-5 w-5" strokeWidth={1.5} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            )}
          </button>
        </div>

        <div className="flex justify-center">
          <Link
            href={ROUTES.home}
            transitionTypes={isHome ? [] : ["nav-back"]}
            className={cn(
              "font-display text-2xl tracking-[0.15em] transition-opacity duration-300",
              solid ? "opacity-100" : "opacity-0"
            )}
          >
            {SITE_CONFIG.name}
          </Link>
        </div>

        <div className="flex items-center justify-end gap-4 sm:gap-5">
          <NavbarSearch products={products} open={searchOpen} onOpenChange={setSearchOpen} />
          <Link
            href={accountHref}
            aria-label="Account"
            className="hidden transition-opacity hover:opacity-60 sm:block"
          >
            <User className="h-5 w-5" strokeWidth={1.5} />
          </Link>
          <Link
            href={ROUTES.cart}
            aria-label={`Cart${count > 0 ? ` (${count} items)` : ""}`}
            className="relative transition-opacity hover:opacity-60"
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] font-medium leading-none text-white"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>
      </nav>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-0 top-full border-b border-neutral-200 bg-white text-black"
          >
            <div className="mx-auto flex max-w-7xl flex-col px-6 py-4">
              {LEFT_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  transitionTypes={
                    link.href === ROUTES.home && !isHome ? ["nav-back"] : ["nav-forward"]
                  }
                  onClick={closeMenu}
                  className="border-b border-neutral-100 py-4 text-sm uppercase tracking-widest transition-opacity last:border-b-0 hover:opacity-60"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={accountHref}
                onClick={closeMenu}
                className="border-b border-neutral-100 py-4 text-sm uppercase tracking-widest transition-opacity hover:opacity-60"
              >
                Account
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
