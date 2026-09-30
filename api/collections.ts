import type { Product } from "@/types";
import { listProducts, type ProductSort } from "./products";

export interface StorefrontCollection {
  slug: string;
  pretitle: string;
  title: string;
  description: string;
  products: Product[];
}

type CollectionRule = {
  slug: string;
  pretitle: string;
  title: string;
  description: string;
  filter: { category?: string };
};

const COLLECTION_RULES: CollectionRule[] = [
  {
    slug: "mens-new-arrivals",
    pretitle: "FW2026",
    title: "Men's Exclusive",
    description: "The latest menswear drops from the current season.",
    filter: { category: "men" },
  },
  {
    slug: "womens-new-arrivals",
    pretitle: "FW2026",
    title: "Women's Exclusive",
    description: "The latest womenswear drops from the current season.",
    filter: { category: "women" },
  },
  {
    slug: "new-arrivals",
    pretitle: "Just Landed",
    title: "New Arrivals",
    description: "Fresh pieces, added as they drop.",
    filter: {},
  },
];

export function getCollectionRules(): CollectionRule[] {
  return COLLECTION_RULES;
}

export async function getCollection(
  slug: string
): Promise<StorefrontCollection | null> {
  const rule = COLLECTION_RULES.find((candidate) => candidate.slug === slug);
  if (!rule) return null;

  const products = await listProducts({ ...rule.filter, sort: "newest" });
  return {
    slug: rule.slug,
    pretitle: rule.pretitle,
    title: rule.title,
    description: rule.description,
    products,
  };
}

/** Convenience for sitemaps / static params. */
export async function listCollectionSlugs(): Promise<string[]> {
  return COLLECTION_RULES.map((rule) => rule.slug);
}

export type { ProductSort };
