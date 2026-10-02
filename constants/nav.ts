import { ROUTES } from "./routes";

/**
 * Navigation definitions. Every href here must resolve to an existing page —
 * check `app/` routes before adding entries.
 */
export const MAIN_NAV = [
  { label: "Home", href: ROUTES.home },
  { label: "Catalog", href: ROUTES.shop },
  { label: "New Arrivals", href: "/collections/new-arrivals" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_NAV = {
  company: [
    { label: "Home", href: ROUTES.home },
    { label: "Contact", href: "/contact" },
  ],
  help: [
    { label: "Shipping", href: "/shipping" },
    { label: "Returns", href: "/returns" },
  ],
} as const;
