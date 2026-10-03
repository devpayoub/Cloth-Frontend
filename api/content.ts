import { medusaClient } from "./client";
import {
  banners as defaultBanners,
  catalogContent,
  cartContent,
  heroContent,
} from "@/content/site";
import type { BannerContent } from "@/content/site";
import { CATALOG_REVALIDATE_SECONDS } from "./config";

/**
 * Site section content resolved from the backend (edited by the client in
 * the Medusa Admin "Site Content" page), deep-merged over the static
 * defaults in content/site.ts. If the backend is unreachable or nothing is
 * customized yet, the static defaults are returned unchanged.
 */
export type SiteContent = {
  hero: typeof heroContent;
  banners: BannerContent[];
  catalog: typeof catalogContent;
  cart: typeof cartContent;
};

export const fallbackSiteContent: SiteContent = {
  hero: heroContent,
  banners: defaultBanners,
  catalog: catalogContent,
  cart: cartContent,
};

type PartialContent = {
  hero?: Partial<SiteContent["hero"]>;
  banners?: Partial<BannerContent>[];
  catalog?: Partial<SiteContent["catalog"]>;
  cart?: Partial<SiteContent["cart"]>;
};

function mergeContent(db: PartialContent | null): SiteContent {
  if (!db) return fallbackSiteContent;
  const bannerCount = Math.max(defaultBanners.length, db.banners?.length ?? 0);
  return {
    hero: { ...heroContent, ...db.hero },
    banners: Array.from({ length: bannerCount }, (_, i) => ({
      ...defaultBanners[i],
      ...db.banners?.[i],
    })),
    catalog: { ...catalogContent, ...db.catalog },
    cart: { ...cartContent, ...db.cart },
  };
}

let contentCache: { promise: Promise<SiteContent>; at: number } | null = null;
const TTL_MS = CATALOG_REVALIDATE_SECONDS * 1000;

export async function getSiteContent(): Promise<SiteContent> {
  const now = Date.now();
  if (!contentCache || TTL_MS === 0 || now - contentCache.at > TTL_MS) {
    contentCache = {
      at: now,
      promise: medusaClient
        .get<{ content: PartialContent | null }>("/store/site-content", {
          revalidate: CATALOG_REVALIDATE_SECONDS,
        })
        .then((res) => mergeContent(res.content))
        .catch(() => fallbackSiteContent),
    };
  }
  return contentCache.promise;
}
