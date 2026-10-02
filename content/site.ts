/**
 * ─────────────────────────────────────────────────────────────────────────
 *  SITE CONTENT — single source of truth for every homepage section.
 *  Edit images (paths under /public) and copy here; no component changes
 *  needed. Images live in frontend/public.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const heroContent = {
  image: "/HOME.png",
  /** Big display title over the hero. */
  title: "Cloth",
  alt: "Cloth — FW2026 collection",
  /** How long the opening zoom lasts, in seconds. */
  introDuration: 2,
};

export type BannerContent = {
  image: string;
  alt: string;
  pretitle: string;
  title: string;
  buttonLabel: string;
  href: string;
};

export const banners: BannerContent[] = [
  {
    image: "/banner-womens.webp",
    alt: "Women's exclusive FW2026 looks",
    pretitle: "FW2026",
    title: "Women's Exclusive",
    buttonLabel: "Shop Now",
    href: "/collections/womens-new-arrivals",
  },
  {
    image: "/banner-man.webp",
    alt: "Men's exclusive FW2026 looks",
    pretitle: "FW2026",
    title: "Men's Exclusive",
    buttonLabel: "Shop Now",
    href: "/collections/mens-new-arrivals",
  },
  {
    image: "/banner-man2.webp",
    alt: "New arrivals FW2026",
    pretitle: "FW2026",
    title: "New Arrivals",
    buttonLabel: "Shop Now",
    href: "/collections/new-arrivals",
  },
];

export const catalogContent = {
  eyebrow: "FW2026 Collection",
  title: "Catalog",
  description: "Every piece from the current season, cut in limited runs.",
};

export const cartContent = {
  eyebrow: "Your selection",
  title: "Cart",
  emptyTitle: "Your cart is empty",
  emptyDescription:
    "Pieces you add will be kept here, on this device, until you are ready.",
};
