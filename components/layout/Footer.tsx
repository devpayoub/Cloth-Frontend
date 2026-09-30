import Link from "next/link";
import { ROUTES, SITE_CONFIG } from "@/constants";

export function Footer() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-0 flex h-[420px] flex-col justify-center bg-black text-white">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 text-center sm:grid-cols-3 sm:px-10 sm:text-left">
        <div className="flex flex-col gap-2 text-sm text-neutral-400">
          <span className="text-xs uppercase tracking-widest text-white">
            Shop
          </span>
          <Link href={ROUTES.home} className="hover:text-white">
            Home
          </Link>
          <Link href={ROUTES.shop} className="hover:text-white">
            Catalog
          </Link>
          <Link href="/contact" className="hover:text-white">
            Contact
          </Link>
        </div>

        <span className="order-first font-display text-6xl tracking-[0.15em] sm:order-none sm:text-7xl">
          {SITE_CONFIG.name}
        </span>

        <div className="flex flex-col gap-2 text-sm text-neutral-400 sm:items-end">
          <span className="text-xs uppercase tracking-widest text-white">
            Info
          </span>
          <Link href="/shipping" className="hover:text-white">
            Shipping
          </Link>
          <Link href="/returns" className="hover:text-white">
            Returns
          </Link>
        </div>
      </div>
    </footer>
  );
}
